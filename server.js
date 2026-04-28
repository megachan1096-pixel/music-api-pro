import express from "express";
import ytdl from "@distube/ytdl-core";

const app = express();

app.get("/", (req, res) => {
  res.send("API Multi Music OK");
});

app.get("/play", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Masukkan URL");

  try {
    if (!ytdl.validateURL(url)) {
      return res.send("Link tidak valid");
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio"
    });

    if (!format || !format.url) {
      return res.send("Gagal ambil audio");
    }

    return res.redirect(format.url);

  } catch (err) {
    console.log(err);
    res.send("Error server");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
