const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("✅ API MUSIC PRO AKTIF");
});

app.get('/play', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.json({ status: false, error: "URL kosong" });
    }

    try {
        // API fallback (tanpa yt-dlp)
        const api = `https://api.vevioz.com/api/button/mp3?url=${encodeURIComponent(url)}`;

        res.json({
            status: true,
            result: api
        });

    } catch (e) {
        res.json({
            status: false,
            error: "Gagal mengambil audio"
        });
    }
});

app.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});
