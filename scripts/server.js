import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ELEVEN_API_KEY;
if (!API_KEY) {
  console.error("Falta ELEVEN_API_KEY en el archivo .env");
  process.exit(1);
}
const PORT = process.env.PORT || 3000;

app.post("/tts", async (req, res) => {
  try {

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: req.body.text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.log(error);
      return res.status(500).send(error);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el servidor");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});