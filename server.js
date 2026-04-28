import express from "express";
import ytdl from "@distube/ytdl-core";

const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Music API PRO READY");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (!ytdl.validateURL(url)) {
        return res.send("URL tidak valid");
      }

      const info = await ytdl.getInfo(url);

      const format = ytdl.chooseFormat(info.formats, {
        quality: "highestaudio",
        filter: "audioonly"
      });

      return res.redirect(format.url);
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      const api = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await api.json();

      if (!data.data || !data.data.music) {
        return res.send("Gagal ambil audio TikTok");
      }

      return res.redirect(data.data.music);
    }

    res.send("Platform tidak didukung");

  } catch (err) {
    console.log(err);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Server jalan"));
