const fs = require("fs");
const path = require("path");
const request = require("request");
const dir = path.join(__dirname, "..", "bin");
const filepath = path.join(dir, "youtube-dl");

if (!fs.existsSync(dir)) fs.mkdirSync(dir, 458);

const onerror = (err) => {
  console.error(err.message || err || "Unexpected error");

  process.exit(1);
};

module.exports = () => {
  console.log("🚀 Downloading latest youtube-dl");

  const reqSettings = {
    url: "https://youtube-dl.org/downloads/latest/youtube-dl",
    method: "GET",
    encoding: null,
  };

  request(reqSettings)
    .pipe(fs.createWriteStream(filepath, { mode: 457 }))
    .on("close", () => {
      console.log("🎉 Youtube-dl lib has up to date.");
    })
    .on("error", (err) => onerror(err));
};
//   () => {
//   console.log("🚀 Downloading latest youtube-dl");

//   const reqSettings = {
//     url: "https://youtube-dl.org/downloads/latest/youtube-dl",
//     method: "GET",
//     encoding: null,
//   };

//   request(reqSettings)
//     .pipe(fs.createWriteStream(filepath, { mode: 457 }))
//     .on("close", () => {
//       console.log("🎉 Youtube-dl lib has up to date.");
//     })
//     .on("error", (err) => onerror(err));
// };
