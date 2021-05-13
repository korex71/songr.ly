const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const secondsToMinutes = (time) => {
  if (isNaN(time)) return "";
  let seconds = Math.floor(time % 60);

  return Math.floor(time / 60) + ":" + seconds < 10 ? "0" + seconds : seconds;
};

export { secondsToMinutes, getRandomInt };
