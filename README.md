# Roadmap 90 días — Agencia de automatización con IA

Dos aplicaciones de una sola página, sin backend ni dependencias: `index.html` (tu roadmap de 90 días) y `jarvis.html` (tu asistente de voz personal).

## `index.html` — Roadmap tracker

Aplicación estilo classroom (tipo Skool) para seguir tu progreso en el plan de 90 días.

## Cómo usarla

- Abre `index.html` con doble clic en cualquier navegador (Chrome, Edge, Safari...). No necesita internet ni instalación.
- La pestaña **Plan diario** es la pantalla principal: muestra el "Día N de 90" en el que estás, con tus hábitos de hoy (técnico, gimnasio, captación, Python, vídeo) y la tarea específica de esa quincena del currículum (si toca ese día). El Día 1 es tu fecha de inicio (por defecto, el día que abras la app por primera vez).
- Cuando marcas **todas** las tareas del día, se habilita el botón "Completar Día N y pasar al Día N+1": al pulsarlo, ese día queda archivado en el Historial y la app genera automáticamente el checklist del día siguiente, en blanco. Así el plan avanza a tu ritmo real, no al del calendario — si un día no llegas a todo, simplemente sigues en ese mismo número hasta completarlo.
- Puedes navegar con las flechas "← Anterior / Siguiente →" para revisar (en solo lectura) cualquier día ya completado; no se puede avanzar más allá del día actual.
- Marcar una tarea de currículum desde el Plan diario también la marca en su pestaña de **Fase** correspondiente (Fase 0-3, Errores, Antes de cobrar), que quedan como referencia con todo el contenido explicado — y viceversa.
- En **Ajustes** puedes cambiar la fecha de inicio (recalcula fechas mostradas, no tu progreso) y ver la cuenta atrás hasta los checkpoints de los días 30, 60 y 90 en la pestaña **Checkpoints**.
- Usa **Exportar** de vez en cuando para descargar un backup en JSON de todo tu progreso, incluido el día en el que vas (útil si cambias de navegador/dispositivo). **Importar** restaura ese backup.

## `jarvis.html` — Asistente personal de voz

Un "Jarvis" al que le hablas (o le escribes) desde el navegador. Pensado para uso personal del día a día y también como pieza de portfolio para enseñar a clientes de la agencia.

- Pulsa el círculo central y habla, o escribe abajo si prefieres no usar la voz — ambas vías funcionan igual.
- Sin ninguna configuración, ya sabe: decirte la hora y la fecha, tomar notas ("añade una nota: ..."), listarlas ("mis notas"), poner recordatorios ("recuérdame llamar al cliente en 20 minutos" o "a las 18:30"), y poner un temporizador ("temporizador de 10 minutos"). Todo se guarda en tu navegador.
- Los recordatorios solo suenan mientras la pestaña esté abierta — no es un despertador en segundo plano ni una app del sistema operativo, es una página web.
- En **Ajustes** (⚙️) puedes añadir tu propia clave de API de Claude para que, además de esos comandos, responda cualquier pregunta abierta. La clave se guarda solo en tu navegador y se envía directamente desde ahí a la API de Anthropic — no pasa por ningún servidor mío. Si la guardas, ponle un límite de gasto en console.anthropic.com.
- El reconocimiento de voz necesita Chrome o Edge (Firefox y Safari no lo soportan bien); si tu navegador no lo soporta, la app te avisa y sigue funcionando por texto.

## Alojarlas online (opcional)

Si prefieres tener una URL en vez de abrir los archivos en local, puedes activar GitHub Pages en este repositorio (Settings → Pages → Deploy from branch), o subirlos a cualquier hosting estático (Vercel, Netlify, etc.). El reconocimiento de voz de Jarvis es más fiable servido por HTTPS que abierto como archivo local. El progreso sigue guardándose por navegador/dispositivo, no en la nube.

## Notas técnicas

- Sin frameworks ni build step: HTML + CSS + JS vainilla, cada app en un único archivo.
- `index.html`: tema claro/oscuro automático según el sistema, con toggle manual. Todo el contenido del roadmap (fases, semanas, precios, errores a evitar, checkpoints) está incluido en la propia página.
- `jarvis.html`: usa las Web Speech API del navegador (`SpeechRecognition` / `speechSynthesis`) para voz, y opcionalmente la API de Mensajes de Anthropic directamente desde el navegador (bring-your-own-key) para preguntas abiertas.
