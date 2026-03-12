let audioActual = null;
const audioCache = {};
const botsHablando = document.querySelectorAll(".bot-hablando");
const API_URL = "http://localhost:3000"
let audioDisponible = true

export async function escribir(text, elemento, i, siguientePaso) {

    if (i === 0) {
        elemento.textContent = "";

        const audio = await hablar(text);
        if (audio) audio.play();
    }

    if (i < text.length) {
        botsHablando.forEach(bot => bot.classList.add("activo"));
        elemento.textContent += text.charAt(i);
        i++;
        setTimeout(() => escribir(text, elemento, i, siguientePaso), 60);
    } else {
        botsHablando.forEach(bot => bot.classList.remove("activo"));
        elemento.classList.add("sin-cursor");
        siguientePaso();
    }
}

export async function hablar(texto) {

  if (!audioDisponible) return null;

  if (audioActual) audioActual.pause();

  if (audioCache[texto]) {
    audioActual = audioCache[texto];
    return audioActual;
  }

  try {

    const res = await fetch(`${API_URL}/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: texto })
    });

    if (!res.ok) return null;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    audioActual = new Audio(url);
    audioCache[texto] = audioActual;

    return audioActual;

  } catch (err) {
    console.log("Servidor de audio no disponible");
    audioDisponible = false; // ← desactiva audio para siempre
    return null;
  }
}

export async function precargarAudio(texto) {

  if (!audioDisponible) return;

  if (audioCache[texto]) return;

  try {

    const res = await fetch(`${API_URL}/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: texto })
    });

    if (!res.ok) return null;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audioCache[texto] = audio;

    return audio;

  } catch (err) {
    console.log("Audio desactivado");
    audioDisponible = false; // ← corta futuros fetch
    return null;
  }
}