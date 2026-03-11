let audioActual = null;
const audioCache = {};

export async function escribir(text, elemento, i, siguientePaso) {

    if (i === 0) {
        const audio = await hablar(text);
        audio.play();
    }

    if (i < text.length) {
        elemento.textContent += text.charAt(i);
        i++;
        setTimeout(() => escribir(text, elemento, i, siguientePaso), 60);
    } else {
        elemento.classList.add("sin-cursor")
        siguientePaso()
    }
}

export async function hablar(texto) {

  if (audioActual) {
    audioActual.pause();
  }

  if (audioCache[texto]) {
    audioActual = audioCache[texto];
    return audioActual;
  }

  const res = await fetch("http://localhost:3000/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: texto })
  });

  const audioBlob = await res.blob();
  const audioURL = URL.createObjectURL(audioBlob);

  audioActual = new Audio(audioURL);

  return audioActual;
}

export async function precargarAudio(texto) {

  if (audioCache[texto]) return;

  const res = await fetch("http://localhost:3000/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: texto })
  });

  const audioBlob = await res.blob();
  const audioURL = URL.createObjectURL(audioBlob);

  audioActual = new Audio(audioURL);
  audioCache[texto] = audioActual;
  return audioActual;
}