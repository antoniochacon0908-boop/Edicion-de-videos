// server.js — el puente. Sirve index.html y habla con Claude (cerebro) y ElevenLabs (voz).
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

// ---------- 4. Llamadas a las APIs ----------
async function askClaude(userText) {
  var res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system: readSystemPrompt(),
      messages: [{ role: "user", content: userText }]
    })
  });
  if (!res.ok) {
    var errText = await res.text();
    throw new Error("Claude " + res.status + ": " + errText.slice(0, 200));
  }
  var data = await res.json();
  var text = (data.content && data.content[0] && data.content[0].text) || "";
  if (!text) throw new Error("Claude no ha devuelto texto.");
  return text;
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

// ---------- 5. Servidor HTTP (sin frameworks) ----------
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
