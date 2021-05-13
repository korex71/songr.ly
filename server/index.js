const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const log = require("./log");
const abstractyt = require("./stream/");
const router = require("./routes");
const port = 3015;

app.use(cors());
app.use(express.json());
app.use(log);

app.use(router);

app.get("/audio/:id", async (req, res) => {
  try {
    const video = await abstractyt(req.params.id);
    res.send(video);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: true });
  }
});

app.post("/audio", async (req, res) => {
  // Get info
  try {
    const ytId = req.body.id;
    const info = await ytdl.getInfo(ytId);

    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected error", metadata: error.message || error });
  }
});

app.post("/audio/info", async (req, res) => {
  // Get basic info
  try {
    console.log(req.body, "/audio/info");
    const ytId = req.body.id;
    const info = await ytdl.getBasicInfo(ytId);

    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected error", metadata: error.message || error });
  }
});

app.get("/search/:search", async (req, res) => {
  try {
    const { search, limit = 10 } = req.params;
    const filters1 = await ytsr.getFilters(search);
    console.log(filters1);
    const filter1 = filters1.get("Type").get("Video");
    const results = await ytsr(filter1.url, { limit });
    const endRes = results.items.filter((video) => !video.isLive);

    res.json(endRes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal error", metadata: error.message || error });
  }
});

app.get("/:id/", (req, res) => {
  ytdl
    .getInfo(req.params.id)
    .then((info) => {
      const formats = {};
      info.formats
        .filter((file) => file.mimeType.startsWith("audio"))
        .map((file) => {
          return (formats[file.mimeType.split(";")[0]] = file.url);
        });

      res.json({
        url: ytdl.chooseFormat(info.formats, { filter: "audioonly" }).url,
        formats,
        author: info.videoDetails.media.artist || info.videoDetails.author.name,
        title: info.videoDetails.media.song || info.videoDetails.title,
        thumbnails:
          info.videoDetails.media.thumbnails || info.videoDetails.thumbnails,
        related_videos: info.related_videos,
        videoDetails: info.videoDetails,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: err.message || "Unexpected error" });
    });
});

app.get("/play/:id", (req, res) => {
  try {
    const { id } = req.params;

    ytdl(`https://www.youtube.com/watch?v=${id}`, {
      filter: "audioonly",
    }).pipe(res);
  } catch (error) {
    res.json({ error: error.message, message: "ID INVALID" });
  }
});

app.listen(port, () => console.log(`Port: ${port} 🔥`));

/*


  try {
    const { id } = req.params;

    res.writeHead(200, {
      "Content-Type": "audio/mp3",
    });

    ytdl("https://www.youtube.com/watch?v=" + id, {
      filter: "audioonly",
    }).pipe(res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unexpected error", metadata: error.message || error });
  }

  */
module.exports = app;
