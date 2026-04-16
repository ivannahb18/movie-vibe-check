# Movie Vibe Check

A simple web app that gives a quick "vibe check" for a movie title.

You type a movie name, click **Check vibe**, and the app asks a local Ollama model for:
- mood
- tone
- who the movie is for

The result is shown directly in the UI.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (no frameworks)
- [Ollama](https://ollama.com/) running locally
- Model: `gemma3:1b`

## Requirements

Before running the app, make sure:

1. Ollama is installed
2. Ollama is running locally on `http://localhost:11434`
3. The `gemma3:1b` model is available

## Setup and Run

1. Open a terminal in this project folder.
2. Pull the model (first time only):

   ```bash
   ollama pull gemma3:1b
   ```

3. Start Ollama (if it is not already running):

   ```bash
   ollama serve
   ```

4. Start a local web server from the project folder:

   ```bash
   npx serve .
   ```

5. Open the local URL shown in the terminal (usually `http://localhost:3000`).

6. Enter a movie title and click **Check vibe**.

## Notes

- The app calls Ollama's local API endpoint:
  - `http://localhost:11434/api/generate`
- If nothing appears, open browser DevTools Console and check for request errors.
