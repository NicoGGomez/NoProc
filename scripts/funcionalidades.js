let audioActual = null;
const audioCache = {};
const botsHablando = document.querySelectorAll(".bot-hablando");
const API_URL = "http://localhost:3000"

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
    return audioActual;

  } catch (err) {
    console.log("Servidor de audio no disponible");
    return null;
  }
}

export async function precargarAudio(texto) {

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

    const audioBlob = await res.blob();
    const audioURL = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioURL);
    audioCache[texto] = audio;

    return audio;

  } catch (err) {
    console.log("Audio no disponible");
    return null;
  }
}