import express from "express";
import ytdl from "ytdl-core";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("API Multi Music OK");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    // =========================
    // 🎥 YOUTUBE
    // =========================
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (!ytdl.validateURL(url)) {
        return res.send("Link YouTube tidak valid");
      }

      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio"
      });

      return res.redirect(format.url);
    }

    // =========================
    // 🎵 TIKTOK (SCRAPE SIMPLE)
    // =========================
    if (url.includes("tiktok.com")) {
      const api = await fetch(`https://tikwm.com/api/?url=${url}`);
      const data = await api.json();

      if (!data.data || !data.data.music) {
        return res.send("Gagal ambil audio TikTok");
      }

      return res.redirect(data.data.music);
    }

    // =========================
    // 🎧 SPOTIFY → YOUTUBE
    // =========================
    if (url.includes("spotify.com")) {
      const api = await fetch(`https://api.vreden.my.id/api/spotify?url=${url}`);
      const data = await api.json();

      if (!data.result) {
        return res.send("Gagal ambil data Spotify");
      }

      const query = `${data.result.title} ${data.result.artist}`;

      // search YouTube (simple)
      const yt = await fetch(`https://ytsearch.vercel.app/api?query=${encodeURIComponent(query)}`);
      const ytData = await yt.json();

      const video = ytData.result[0]?.url;
      if (!video) return res.send("Gagal cari di YouTube");

      const info = await ytdl.getInfo(video);
      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio"
      });

      return res.redirect(format.url);
    }

    res.send("Platform tidak didukung");

  } catch (err) {
    console.log(err);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
