const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }

        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'video');

        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            formats: formats.map(f => ({
                quality: f.qualityLabel,
                url: f.url
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video" });
    }
};
