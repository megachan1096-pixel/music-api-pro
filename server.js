const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("API MUSIC OK");
});

app.get("/play", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("Masukkan URL");
  }

  // 🔥 langsung redirect ke converter
  const final = "https://api.vevioz.com/api/button/mp3?url=" + encodeURIComponent(url);

  res.redirect(final);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di " + PORT));
