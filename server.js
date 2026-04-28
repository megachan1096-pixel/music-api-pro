import express from "express";
import ytdl from "@distube/ytdl-core";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Music API PRO READY");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    // =========================
    // 🎵 YOUTUBE
    // =========================
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (!ytdl.validateURL(url)) {
        return res.send("URL YouTube tidak valid");
      }

      const info = await ytdl.getInfo(url);

      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: "audioonly"
      });

      return res.redirect(format.url);
    }

    // =========================
    // 🎵 TIKTOK
    // =========================
    if (url.includes("tiktok.com")) {
      const api = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await api.json();

      if (!data.data || !data.data.music) {
        return res.send("Gagal ambil audio TikTok");
      }

      return res.redirect(data.data.music);
    }

    // =========================
    // 🎵 SPOTIFY → YOUTUBE
    // =========================
    if (url.includes("spotify.com")) {
      // ambil metadata sederhana
      const api = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`);
      const data = await api.json();

      const title = data.entitiesByUniqueId
        ? Object.values(data.entitiesByUniqueId)[0]?.title
        : null;

      if (!title) return res.send("Gagal baca Spotify");

      // cari ke YouTube
      const search = `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`;
      return res.redirect(search);
    }

    res.send("Platform tidak didukung");

  } catch (err) {
    console.log(err);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Server jalan"));
