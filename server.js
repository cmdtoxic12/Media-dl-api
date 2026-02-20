const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
// This tells the app to use Render's port, or default to 3000 if testing locally
const PORT = process.env.PORT || 3000; 


app.use(cors());

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send("No URL provided");
    }

    console.log(`Starting download for: ${videoUrl}`);

    // Tell the browser to treat this as a file download
    res.header('Content-Disposition', 'attachment; filename="downloaded_video.mp4"');

    // Execute yt-dlp and pipe the output to the response
    const subprocess = youtubedl.exec(videoUrl, {
        output: '-',      // Tells yt-dlp to output to standard out (the stream)
        format: 'best'    // Grabs the best single file quality
    });

    // Pipe the video data stream directly to the user
    subprocess.stdout.pipe(res);

    subprocess.on('error', (error) => {
        console.error("Error downloading:", error);
        if (!res.headersSent) {
            res.status(500).send("Error processing the video. It might be private or blocked.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
