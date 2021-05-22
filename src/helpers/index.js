const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const secondsToMinutes = (time) =>
  isNaN(time)
    ? ""
    : Math.floor(time / 60) +
      ":" +
      `${
        Math.floor(time % 60) < 10
          ? "0" + String(Math.floor(time % 60))
          : Math.floor(time % 60)
      }`;

export { secondsToMinutes, getRandomInt };
