import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("API Music OK");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    // ambil dari API converter
    const api = await fetch(`https://api.vevioz.com/api/button/mp3?url=${encodeURIComponent(url)}`);
    const text = await api.text();

    // ambil link mp3 dari hasil HTML
    const match = text.match(/href="(https:\/\/[^"]+\.mp3)"/);

    if (!match) {
      return res.send("Gagal ambil audio");
    }

    const audio = match[1];

    // 🔥 langsung redirect (bukan JSON)
    res.redirect(audio);

  } catch (err) {
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
