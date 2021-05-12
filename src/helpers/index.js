const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const secondsToMinutes = (time) => {
  if (!Number(time)) return "";
  let seconds = Math.floor(time % 60);
  let formatSeconds = seconds < 10 ? "0" + seconds : seconds;

  return Math.floor(time / 60) + ":" + formatSeconds;
};

export { secondsToMinutes, getRandomInt };
