# Roadmap 90 días — Agencia de automatización con IA

Aplicación de una sola página (`index.html`) para seguir tu progreso en el plan de 90 días, estilo classroom (tipo Skool), sin backend ni dependencias.

## Cómo usarla

- Abre `index.html` con doble clic en cualquier navegador (Chrome, Edge, Safari...). No necesita internet ni instalación.
- Marca cada checkbox a medida que completas tareas y entregables. El progreso se guarda automáticamente en el `localStorage` de tu navegador.
- La pestaña **Hoy** tiene tu checklist diario según tu horario (técnico, gimnasio, captación, Python, vídeo), y un tracker semanal de vídeos grabados (meta: 7/semana).
- En **Ajustes** puedes fijar tu fecha de inicio real del plan: la app calcula tu día actual, la semana de currículum en la que deberías estar, y la cuenta atrás hasta los checkpoints de los días 30, 60 y 90.
- Usa **Exportar** de vez en cuando para descargar un backup en JSON de todo tu progreso (útil si cambias de navegador/dispositivo). **Importar** restaura ese backup.

## Alojarla online (opcional)

Si prefieres tener una URL en vez de abrir el archivo local, puedes activar GitHub Pages en este repositorio (Settings → Pages → Deploy from branch) apuntando a la rama con este archivo, o subir `index.html` a cualquier hosting estático (Vercel, Netlify, etc.). El progreso sigue guardándose por navegador/dispositivo, no en la nube.

## Notas técnicas

- Sin frameworks ni build step: HTML + CSS + JS vainilla en un único archivo.
- Tema claro/oscuro automático según el sistema, con toggle manual.
- Todo el contenido del roadmap (fases, semanas, precios, errores a evitar, checkpoints) está incluido en la propia página.
