const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("API MUSIC HARDCORE AKTIF");
});

async function getAudio(url) {
  // API 1 (utama)
  try {
    const r = await fetch("https://co.wuk.sh/api/json?url=" + encodeURIComponent(url));
    const j = await r.json();
    if (j.url) return j.url;
  } catch {}

  // API 2 (backup)
  try {
    const r = await fetch("https://api.cobalt.tools/api/json?url=" + encodeURIComponent(url));
    const j = await r.json();
    if (j.url) return j.url;
  } catch {}

  // API 3 (fallback kasar)
  return "https://api.vevioz.com/api/button/mp3?url=" + encodeURIComponent(url);
}

app.get("/play", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("Masukkan URL");
  }

  try {
    const audio = await getAudio(url);

    if (!audio) {
      return res.send("Gagal ambil audio");
    }

    // 🔥 LANGSUNG PLAY
    res.redirect(audio);

  } catch (e) {
    console.log(e);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di " + PORT));
