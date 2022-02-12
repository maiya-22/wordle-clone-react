import a from "./a";
import s from "./s";

const words = {
  ...a,
  ...s,
};

const getRandomWord = () => {
  let wordKeys = Object.keys(words);
  let randomIndex = Math.floor(Math.random() * wordKeys.length);
  return wordKeys[randomIndex];
};

export default getRandomWord;
