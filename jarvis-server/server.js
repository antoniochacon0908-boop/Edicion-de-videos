// server.js — el puente. Sirve index.html y habla con Claude (cerebro) y ElevenLabs (voz).
// Incluye 3 skills: búsqueda web, notas + recordatorios, y memoria entre conversaciones.
"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");

// ---------- 1. Cargar .env (sin dependencias externas) ----------
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  var content = fs.readFileSync(filePath, "utf8");
  content.split("\n").forEach(function (line) {
    line = line.trim();
    if (!line || line.startsWith("#")) return;
    var idx = line.indexOf("=");
    if (idx === -1) return;
    var key = line.slice(0, idx).trim();
    var val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  });
}
loadEnv(path.join(__dirname, ".env"));

// ---------- 2. Comprobar que están las tres claves ----------
var REQUIRED_KEYS = ["ANTHROPIC_API_KEY", "ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID"];
var missing = REQUIRED_KEYS.filter(function (k) { return !process.env[k]; });
if (missing.length) {
  console.error("Falta esto en tu .env: " + missing.join(", "));
  console.error("Copia .env.example a .env y rellena los valores (mira LEEME.md).");
  process.exit(1);
}

// ⚠ Si Claude te da un error 400, casi siempre es que este nombre de modelo no es válido en tu cuenta.
var CLAUDE_MODEL = "claude-sonnet-5";
var ELEVENLABS_MODEL = "eleven_multilingual_v2";
var MEMORY_MAX_PARES = 16; // cuántos pares usuario/Jarvis se conservan como memoria (ventana deslizante, no es memoria infinita)

// ---------- 3. Personalidad ----------
var PROMPT_PATH = path.join(__dirname, "prompt.md");
function readSystemPrompt() {
  try {
    return fs.readFileSync(PROMPT_PATH, "utf8");
  } catch (e) {
    console.error("No encuentro prompt.md junto a server.js.");
    return "Eres un asistente personal. Responde en español, breve y directo.";
  }
}

// ---------- 4. Datos persistentes: notas, recordatorios, memoria ----------
var DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
var NOTES_PATH = path.join(DATA_DIR, "notes.json");
var REMINDERS_PATH = path.join(DATA_DIR, "reminders.json");
var MEMORY_PATH = path.join(DATA_DIR, "memory.json");

function readJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return fallback; }
}
function writeJSON(p, val) { fs.writeFileSync(p, JSON.stringify(val, null, 2)); }

function getNotes() { return readJSON(NOTES_PATH, []); }
function saveNotes(n) { writeJSON(NOTES_PATH, n); }
function getReminders() { return readJSON(REMINDERS_PATH, []); }
function saveReminders(r) { writeJSON(REMINDERS_PATH, r); }
function getMemory() { return readJSON(MEMORY_PATH, []); }
function saveMemory(m) { writeJSON(MEMORY_PATH, m); }

// ---------- 5. Herramientas que Claude puede usar ----------
// web_search_20250305 la resuelve Anthropic por su cuenta (no la ejecutamos nosotros).
// Las demás ("custom tools") las ejecuta este servidor cuando Claude decide usarlas.
var TOOLS = [
  { type: "web_search_20250305", name: "web_search", max_uses: 5 },
  {
    name: "add_note",
    description: "Guarda una nota corta para el usuario, para consultarla más tarde. Úsala cuando pida que apuntes o guardes algo.",
    input_schema: {
      type: "object",
      properties: { text: { type: "string", description: "Contenido de la nota" } },
      required: ["text"]
    }
  },
  {
    name: "list_notes",
    description: "Devuelve las notas guardadas del usuario. Úsala cuando pregunte qué notas tiene.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "add_reminder",
    description: "Crea un recordatorio para el usuario. Usa minutes_from_now si dice 'en X minutos', o due_time (HH:MM, 24h) si da una hora concreta de hoy.",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string", description: "Qué hay que recordar" },
        minutes_from_now: { type: "integer", description: "Minutos desde ahora hasta el aviso" },
        due_time: { type: "string", description: "Hora de hoy en formato HH:MM (24h)" }
      },
      required: ["text"]
    }
  },
  {
    name: "list_reminders",
    description: "Devuelve los recordatorios pendientes del usuario.",
    input_schema: { type: "object", properties: {} }
  }
];

function executeCustomTool(name, input) {
  input = input || {};
  if (name === "add_note") {
    var notes = getNotes();
    var note = { text: String(input.text || "").trim(), at: new Date().toISOString() };
    notes.push(note);
    saveNotes(notes);
    return { ok: true, nota_guardada: note.text };
  }
  if (name === "list_notes") {
    return { notas: getNotes().map(function (n) { return n.text; }) };
  }
  if (name === "add_reminder") {
    var due;
    if (input.minutes_from_now) {
      due = new Date(Date.now() + Number(input.minutes_from_now) * 60000);
    } else if (input.due_time) {
      var parts = String(input.due_time).split(":");
      due = new Date();
      due.setHours(parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, 0, 0);
      if (due.getTime() < Date.now()) due.setDate(due.getDate() + 1);
    } else {
      return { error: "Falta minutes_from_now o due_time." };
    }
    var reminders = getReminders();
    reminders.push({ id: Date.now() + "", text: String(input.text || "").trim(), due: due.toISOString(), notified: false });
    saveReminders(reminders);
    return { ok: true, texto: input.text, aviso: due.toISOString() };
  }
  if (name === "list_reminders") {
    var pending = getReminders().filter(function (r) { return !r.notified; });
    return { recordatorios: pending.map(function (r) { return { texto: r.text, aviso: r.due }; }) };
  }
  return { error: "Herramienta desconocida: " + name };
}

// ---------- 6. Llamadas a las APIs ----------
async function callClaude(messages) {
  var res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system: readSystemPrompt(),
      tools: TOOLS,
      messages: messages
    })
  });
  if (!res.ok) {
    var errText = await res.text();
    throw new Error("Claude " + res.status + ": " + errText.slice(0, 300));
  }
  return res.json();
}

async function askClaude(userText) {
  var history = getMemory();
  var messages = history.concat([{ role: "user", content: userText }]);

  var finalText = "";
  for (var i = 0; i < 4; i++) {
    var data = await callClaude(messages);
    var textParts = (data.content || []).filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; });
    if (textParts.length) finalText = textParts.join(" ").trim();

    if (data.stop_reason !== "tool_use") break;

    var toolUses = (data.content || []).filter(function (b) { return b.type === "tool_use"; });
    if (!toolUses.length) break;

    messages.push({ role: "assistant", content: data.content });
    var resultsContent = toolUses.map(function (tu) {
      var result = executeCustomTool(tu.name, tu.input);
      return { type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(result) };
    });
    messages.push({ role: "user", content: resultsContent });
  }

  if (!finalText) finalText = "No he podido generar una respuesta.";

  history.push({ role: "user", content: userText });
  history.push({ role: "assistant", content: finalText });
  while (history.length > MEMORY_MAX_PARES * 2) history.shift();
  saveMemory(history);

  return finalText;
}

async function textToSpeech(text) {
  var res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + process.env.ELEVENLABS_VOICE_ID, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "content-type": "application/json",
      "accept": "audio/mpeg"
    },
    body: JSON.stringify({
      text: text,
      model_id: ELEVENLABS_MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });
  if (!res.ok) {
    var errText = await res.text();
    throw new Error("ElevenLabs " + res.status + ": " + errText.slice(0, 200));
  }
  var buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

async function handleChat(userText) {
  var replyText = await askClaude(userText);
  var audioBase64 = await textToSpeech(replyText);
  return { text: replyText, audio: audioBase64 };
}

async function checkDueReminders() {
  var reminders = getReminders();
  var now = Date.now();
  var due = reminders.filter(function (r) { return !r.notified && new Date(r.due).getTime() <= now; });
  if (!due.length) return { text: null };
  due.forEach(function (r) { r.notified = true; });
  saveReminders(reminders);
  var text = due.length === 1
    ? ("Recordatorio: " + due[0].text + ".")
    : ("Tienes " + due.length + " recordatorios: " + due.map(function (r) { return r.text; }).join(". ") + ".");
  var audioBase64 = await textToSpeech(text);
  return { text: text, audio: audioBase64 };
}

// ---------- 7. Servidor HTTP (sin frameworks) ----------
var INDEX_PATH = path.join(__dirname, "index.html");

function readRequestBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    req.on("data", function (c) { chunks.push(c); });
    req.on("end", function () { resolve(Buffer.concat(chunks).toString("utf8")); });
    req.on("error", reject);
  });
}

var server = http.createServer(function (req, res) {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    fs.readFile(INDEX_PATH, "utf8", function (err, html) {
      if (err) { res.writeHead(500); res.end("No encuentro index.html"); return; }
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    });
    return;
  }

  if (req.method === "GET" && req.url === "/api/reminders/due") {
    checkDueReminders().then(function (result) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(result));
    }).catch(function (err) {
      console.error(err);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    readRequestBody(req).then(function (body) {
      var userText;
      try {
        userText = JSON.parse(body).text;
      } catch (e) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Cuerpo inválido, esperaba JSON con { text }." }));
        return;
      }
      if (!userText || !userText.trim()) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Texto vacío." }));
        return;
      }
      handleChat(userText.trim()).then(function (result) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      }).catch(function (err) {
        console.error(err);
        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    }).catch(function (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("No encontrado");
});

var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("JARVIS escuchando en http://localhost:" + PORT);
});
