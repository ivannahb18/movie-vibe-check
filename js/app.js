document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector('input[name="movie-query"]');
  const button = document.querySelector(".search-block .btn--primary");
  const previewMeta = document.querySelector(".preview__meta");
  const previewTitle = document.querySelector(".preview__title");
  const previewTagline = document.querySelector(".preview__tagline");
  const vibeChips = document.querySelectorAll(".vibe-chips__item");

  if (!input || !button || !previewMeta || !previewTitle || !previewTagline) return;

  const sanitizeText = (value) =>
    value
      .replace(/^\s*(?:[-*•●▪◦·]|\d+[.)])\s*/g, "")
      .replace(/[*_`>#]/g, "")
      .replace(/[•●▪◦·]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const extractField = (text, key) => {
    const regex = new RegExp(`^${key}:\\s*(.+)$`, "im");
    const match = text.match(regex);
    return match ? sanitizeText(match[1]) : "";
  };

  button.addEventListener("click", async () => {
    const movieTitle = input.value.trim();

    if (!movieTitle) {
      console.warn("Enter a movie title first.");
      return;
    }

    const prompt = `Give a short, fun vibe check for the movie "${movieTitle}".
Respond in plain text only, no markdown, no bullet points, no asterisks.
Use exactly this 4-line format:
Mood: <1-3 words>
Tone: <1-3 words>
For: <2-6 words about audience>
Vibe: <one short sentence, max 20 words>.`;
    const defaultButtonText = button.textContent;

    button.disabled = true;
    button.textContent = "Checking...";

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data = await response.json();
      const rawResponse = data.response?.trim() || "";
      console.log("Raw Ollama response:", rawResponse);
      const mood = extractField(rawResponse, "Mood") || "Mixed";
      const tone = extractField(rawResponse, "Tone") || "Cinematic";
      const audience = extractField(rawResponse, "For") || "General audiences";
      const vibeLine =
        extractField(rawResponse, "Vibe") || sanitizeText(rawResponse) || "No vibe returned.";

      previewMeta.textContent = "AI Vibe Check";
      previewTitle.textContent = movieTitle;
      previewTagline.textContent = vibeLine;

      if (vibeChips.length >= 3) {
        vibeChips[0].textContent = mood;
        vibeChips[1].textContent = tone;
        vibeChips[2].textContent = audience;
      }
    } catch (error) {
      console.error("Error calling Ollama:", error);
      previewMeta.textContent = "AI Vibe Check";
      previewTitle.textContent = movieTitle;
      previewTagline.textContent = "Could not fetch vibe right now. Try again.";
    } finally {
      button.disabled = false;
      button.textContent = defaultButtonText;
    }
  });
});
