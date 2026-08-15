# OpenJarvis (el proyecto real de Stanford) — segundo asistente, aparte

Esto **no** es el Jarvis que ya tienes en `jarvis-server/` (Node + Claude + ElevenLabs + palmadas).
Es un proyecto de investigación independiente — [open-jarvis/OpenJarvis](https://github.com/open-jarvis/OpenJarvis) —
de Stanford (Hazy Research / Scaling Intelligence Lab), pensado para correr modelos de IA en local
en tu propio ordenador, con su propia CLI, sus propios agentes y su propio sistema de "skills".

Lo instalas si de verdad quieres ese proyecto en concreto, no como un añadido a tu Jarvis actual —
son incompatibles a nivel de arquitectura (Python + Ollama + modelos locales, frente a Node + Claude
+ ElevenLabs). Puedes tener los dos instalados a la vez sin que se molesten entre sí, eso sí.

## Qué necesitas antes de instalar

- Windows 10 (1809+) u 11.
- **Python 3.10 a 3.13** (la 3.14 aún no tiene ruedas de numpy para Windows) — https://www.python.org/downloads/,
  marcando "Add python.exe to PATH" al instalar.
- **git** — https://git-scm.com/download/win
- Unos 5 GB libres en el disco donde está `%LOCALAPPDATA%`.

## Instalar

Doble clic en `instalar-openjarvis-real.bat`. Comprueba Python y git, y si están, lanza el
instalador **oficial** del propio proyecto (`irm https://open-jarvis.github.io/OpenJarvis/install.ps1 | iex`) —
no es un script mío, es el que publica OpenJarvis. Tarda varios minutos: instala `uv`, clona su
repositorio a `%LOCALAPPDATA%\OpenJarvis`, instala Ollama, y descarga un modelo de IA pequeño para
empezar.

## Usarlo

Abre una terminal **nueva** (para que coja el PATH actualizado) y escribe:

```
jarvis
```

Eso arranca el chat por defecto. También puedes elegir un preset concreto:

```
jarvis init --preset chat-simple
```

## Instalar skills de verdad

Esto es lo que buscabas originalmente — aquí sí existen skills reales, importadas de fuentes
externas (Hermes Agent, ~150 skills; OpenClaw, ~13.700 skills comunitarias):

```
jarvis skill install hermes:arxiv
jarvis skill sync hermes --category research
jarvis skill list
jarvis skill info research-and-summarize
```

## Si algo falla

- `"jarvis" no se reconoce como comando` → cierra y abre una terminal nueva (el instalador añade
  la ruta al PATH, pero las terminales ya abiertas no se enteran).
- Cualquier otro fallo durante la instalación → es del instalador oficial, no de este `.bat`.
  Revisa la [guía de instalación en Windows](https://open-jarvis.github.io/OpenJarvis/getting-started/windows-native/)
  del propio proyecto, o su [Discord](https://discord.gg/CMVBmDQ5Fj).

## Aviso

No he podido ejecutar ni probar este instalador en un Windows real — ni el `.bat` ni el instalador
oficial de OpenJarvis al que llama. Lo que sí he hecho es leer el código y la documentación reales
del repositorio para que los pasos de arriba sean exactos y no una suposición. Si algo no cuadra
con lo que ves en pantalla, dímelo con el mensaje exacto.
