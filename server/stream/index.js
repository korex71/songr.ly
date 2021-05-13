const { spawn, exec } = require("child_process"),
  path = require("path"),
  es = require("event-stream");

require("./helpers/ytdl-get");

/*
 * Create a stream of video w/ youtube-dl.
 *
 * @param  {String}        videoID   - The id of video.
 * @param  {Array<String>} [options] - Options for youtube-dl.
 * @return {DuplexStream} - The stream of the video.
 */
module.exports = (videoID) => {
  return new Promise((resolve, reject) => {
    // Prepare options.
    const video_url = "https://www.youtube.com/" + videoID;

    // Pipe the stream.
    var script_path = path.join(__dirname, "bin", "youtube-dl");
    console.log(script_path, ["-j", video_url]);
    // var ytdl = spawn(script_path, ["-j", video_url]);
    let ytdl = spawn(script_path, ["-j", video_url]);
    return resolve(ytdl.stdout);
  });
};

// module.exports = streamAudio;
