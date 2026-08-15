# JARVIS — arranque

## Windows: instalación en un clic (recomendado)

1. Crea una carpeta en tu Escritorio (por ejemplo `Jarvis`) y mete ahí dentro **todos** los
   archivos de este proyecto juntos: `server.js`, `index.html`, `prompt.md`, `.env.example`,
   `.gitignore`, `package.json`, `instalar.bat`, `iniciar-jarvis-visible.bat` y este `LEEME.md`.
2. Si no tienes Node instalado, instálalo desde https://nodejs.org (versión LTS) y reinicia el PC.
3. Haz **doble clic en `instalar.bat`**. Te va a pedir, una por una, tus tres claves (Anthropic,
   ElevenLabs y el Voice ID) y las guarda por ti en un `.env` en esa misma carpeta — no tienes que
   tocar ningún archivo a mano.
4. Al terminar, deja un lanzador (`iniciar-jarvis.vbs`) metido en tu carpeta de Inicio de Windows:
   a partir de ahora, cada vez que enciendas o inicies sesión en el PC, Jarvis arranca solo y te
   abre `http://localhost:3000` en el navegador. No hace falta que abras ninguna terminal.
5. Para probarlo ahora mismo sin reiniciar el PC, haz doble clic en `iniciar-jarvis.vbs` (queda en
   la misma carpeta). No verás ninguna ventana — arranca en segundo plano y se te abre el navegador solo.
6. Si algo no funciona y quieres ver el error en pantalla, usa en su lugar `iniciar-jarvis-visible.bat`
   (ese sí muestra una ventana con lo que va pasando).

**Para parar Jarvis**: como corre oculto, no hay ventana que cerrar. Abre el Administrador de tareas
(Ctrl+Shift+Esc), busca el proceso "Node.js JavaScript Runtime" y dale a Finalizar tarea.

**Para desactivar el arranque automático**: pulsa `Win+R`, escribe `shell:startup`, Enter, y borra ahí
el archivo `iniciar-jarvis.vbs`.

**Aviso**: este instalador no lo he podido probar en un Windows real (lo he escrito con cuidado y con
los patrones estándar de `.bat`, pero no tengo forma de ejecutarlo aquí). Si algo se comporta raro,
dímelo con el mensaje exacto y lo arreglo.

Si prefieres el camino manual (o estás en Mac/Linux), sigue los pasos de abajo.

## 1. Node

Comprueba si lo tienes. Abre la terminal y escribe:

```
node -v
```

Si sale un número igual o mayor que `v18`, listo. Si dice que no encuentra el comando, instálalo desde https://nodejs.org (versión LTS).

## 2. Las claves

**ElevenLabs** → entra en tu cuenta, apartado de API keys, y crea una. Empieza por `sk_`.
Tu `voice_id` ya lo tienes.

**Anthropic** → https://console.anthropic.com, apartado API keys. Ojo: esto es la API, se paga
por uso y es una cuenta distinta de tu suscripción de Claude. Para probar son céntimos,
pero mete un límite de gasto mensual bajo desde el primer día.

## 3. El archivo .env

Copia `.env.example`, renómbralo a `.env` y pega las tres cosas:

```
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=tu_voice_id
```

Si algún día subes esto a GitHub, crea antes un archivo `.gitignore` con una línea que diga `.env`.
Sin eso, publicas tus claves. (Ese `.gitignore` ya está creado en esta carpeta.)

## 4. Arrancar

Desde la carpeta del proyecto:

```
node server.js
```

Abre http://localhost:3000 y habla.

## Si algo falla

- La terminal te dice qué clave falta nada más arrancar. Empieza por ahí.
- Error 401 de ElevenLabs → la clave está mal copiada o tiene espacios.
- Error 404 de ElevenLabs → el `voice_id` no es correcto.
- Error 400 de Claude → normalmente el nombre del modelo. Está en `server.js`, línea del `CLAUDE_MODEL`.
- No suena nada pero sale el texto → el navegador bloquea el audio hasta que hagas clic
  en la página. Pulsa ENVIAR con el ratón una vez.

## Qué es cada archivo

- `index.html` — la cara. Todo lo visual está aquí.
- `server.js` — el puente. Guarda las claves y habla con Claude y con ElevenLabs.
- `prompt.md` — la personalidad. Edítalo y reinicia el servidor. Aquí es donde de verdad
  se ajusta el asistente: es lo que más cambia el resultado y no requiere tocar código.
- `.env` — tus secretos. Nunca sale de tu ordenador.

## Las palmadas

Pulsa el botón PALMAS una vez para darle permiso de micrófono. A partir de ahí:

- **Dos palmadas seguidas** activan la escucha sin tocar nada.
- **Tres palmadas seguidas** abren "Should I Stay or Should I Go" (The Clash) en una pestaña de YouTube. No es un botón serio, es un capricho — bórralo de `index.html` (función `abrirCancion`) si molesta.

Solo funciona cuando está en reposo, para que no se active con su propia voz. Como Jarvis tiene que
esperar a ver si viene una tercera palmada antes de decidir, activar la escucha con dos palmadas
tarda un poco (el margen de abajo) en confirmarse — es normal, no es que vaya lento.

Si tu habitación es ruidosa y se dispara solo, sube el `0.28` de `vigilarPalmas` en `index.html`.
Si te ignora, bájalo. El segundo número, `0.9`, es el margen máximo entre una palmada y la siguiente
de la misma ráfaga, en segundos.
