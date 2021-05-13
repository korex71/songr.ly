const Regex =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const getVideoID = (url) => (Regex.exec(url) ? Regex.exec(url)[1] : false);

const isValidUrl = (url) => !!String(url).match(Regex);

module.exports = {
  getVideoID,
  isValidUrl,
};
