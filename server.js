const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/", (req, res) => {
  res.send("API Music OK");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    const api = await fetch(`https://api.vevioz.com/api/button/mp3?url=${encodeURIComponent(url)}`);
    const text = await api.text();

    const match = text.match(/href="(https:\/\/[^"]+\.mp3)"/);

    if (!match) {
      return res.send("Gagal ambil audio");
    }

    const audio = match[1];

    res.redirect(audio);

  } catch (err) {
    console.log(err);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
