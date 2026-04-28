const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

let cache = {};

function getAudio(url) {
    return new Promise((resolve, reject) => {
        exec(`yt-dlp -f bestaudio -g "${url}"`, (err, stdout) => {
            if (err) return reject();
            resolve(stdout.trim());
        });
    });
}

app.get('/play', async (req, res) => {
    const url = req.query.url;

    if (!url) return res.send("ERROR");

    if (cache[url]) return res.send(cache[url]);

    try {
        const audio = await getAudio(url);
        cache[url] = audio;
        res.send(audio);
    } catch {
        res.send("ERROR");
    }
});

app.get('/', (req, res) => res.send("API ONLINE"));

app.listen(PORT);