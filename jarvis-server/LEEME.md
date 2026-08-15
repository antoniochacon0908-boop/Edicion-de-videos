# JARVIS — arranque

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

## Las dos palmadas

Pulsa el botón PALMAS una vez para darle permiso de micrófono. A partir de ahí, dos palmadas
seguidas activan la escucha sin tocar nada.

Solo funciona cuando está en reposo, para que no se active con su propia voz. Si tu habitación
es ruidosa y se dispara solo, sube el `0.28` de `vigilarPalmas` en `index.html`. Si te ignora,
bájalo. El segundo número, `0.9`, es el margen entre palmada y palmada en segundos.
