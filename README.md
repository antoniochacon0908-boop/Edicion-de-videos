# Roadmap 90 días — Agencia de automatización con IA

Aplicación de una sola página (`index.html`) para seguir tu progreso en el plan de 90 días, estilo classroom (tipo Skool), sin backend ni dependencias.

## Cómo usarla

- Abre `index.html` con doble clic en cualquier navegador (Chrome, Edge, Safari...). No necesita internet ni instalación.
- La pestaña **Plan diario** es la pantalla principal: muestra el "Día N de 90" en el que estás, con tus hábitos de hoy (técnico, gimnasio, captación, Python, vídeo) y la tarea específica de esa quincena del currículum (si toca ese día). El Día 1 es tu fecha de inicio (por defecto, el día que abras la app por primera vez).
- Cuando marcas **todas** las tareas del día, se habilita el botón "Completar Día N y pasar al Día N+1": al pulsarlo, ese día queda archivado en el Historial y la app genera automáticamente el checklist del día siguiente, en blanco. Así el plan avanza a tu ritmo real, no al del calendario — si un día no llegas a todo, simplemente sigues en ese mismo número hasta completarlo.
- Puedes navegar con las flechas "← Anterior / Siguiente →" para revisar (en solo lectura) cualquier día ya completado; no se puede avanzar más allá del día actual.
- Marcar una tarea de currículum desde el Plan diario también la marca en su pestaña de **Fase** correspondiente (Fase 0-3, Errores, Antes de cobrar), que quedan como referencia con todo el contenido explicado — y viceversa.
- En **Ajustes** puedes cambiar la fecha de inicio (recalcula fechas mostradas, no tu progreso) y ver la cuenta atrás hasta los checkpoints de los días 30, 60 y 90 en la pestaña **Checkpoints**.
- Usa **Exportar** de vez en cuando para descargar un backup en JSON de todo tu progreso, incluido el día en el que vas (útil si cambias de navegador/dispositivo). **Importar** restaura ese backup.

## Alojarla online (opcional)

Si prefieres tener una URL en vez de abrir el archivo local, puedes activar GitHub Pages en este repositorio (Settings → Pages → Deploy from branch) apuntando a la rama con este archivo, o subir `index.html` a cualquier hosting estático (Vercel, Netlify, etc.). El progreso sigue guardándose por navegador/dispositivo, no en la nube.

## Notas técnicas

- Sin frameworks ni build step: HTML + CSS + JS vainilla en un único archivo.
- Tema claro/oscuro automático según el sistema, con toggle manual.
- Todo el contenido del roadmap (fases, semanas, precios, errores a evitar, checkpoints) está incluido en la propia página.

## Claude Code skills incluidas

Este repositorio incluye las [n8n-skills](https://github.com/czlonkowski/n8n-skills) instaladas como skills de proyecto en `.claude/skills/`, junto con la capa de hooks (`.claude/hooks/` + `.claude/settings.json`) que las activa automáticamente en Claude Code. Enseñan a Claude a construir workflows de n8n usando el servidor MCP [n8n-mcp](https://github.com/czlonkowski/n8n-mcp).

- Requiere el MCP server `n8n-mcp` configurado en `.mcp.json` (ver plantilla en `.mcp.json.example`).
- Las skills se activan automáticamente por descripción al trabajar con n8n, workflows, nodos o automatizaciones.
- Licencia MIT — ver `.claude/skills/LICENSE`.

### Workflows de n8n incluidos

En `n8n-workflows/` hay workflows de n8n listos para importar. Incluye un flujo de **gestión de clientes**: formulario → clasificación automática → Google Sheets → email de respuesta personalizado. Ver [`n8n-workflows/README.md`](n8n-workflows/README.md) para instrucciones de importación y configuración.
