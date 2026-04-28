const express = require('express');
const { exec } = require('child_process');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// AUTO INSTALL (biar jalan di Railway)
try { execSync("pip install yt-dlp"); } catch(e) {}
try { execSync("apt update && apt install -y ffmpeg"); } catch(e) {}

// ROOT
app.get('/', (req, res) => {
    res.send("✅ API MUSIC AKTIF");
});

// PLAY ENDPOINT
app.get('/play', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.json({ status: false, error: "URL kosong" });
    }

    // VALIDASI LINK
    if (!url.includes("youtube") && !url.includes("youtu.be") && !url.includes("tiktok") && !url.includes("spotify")) {
        return res.json({ status: false, error: "Link tidak didukung" });
    }

    // COMMAND yt-dlp
    const cmd = `yt-dlp -f bestaudio -g "${url}"`;

    exec(cmd, (err, stdout, stderr) => {
        if (err || !stdout) {
            return res.json({
                status: false,
                error: "Gagal mengambil audio, coba link lain"
            });
        }

        const stream = stdout.trim().split("\n")[0];

        res.json({
            status: true,
            result: stream
        });
    });
});

// SERVER START
app.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});
