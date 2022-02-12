import axios from "axios";
// filtering out non-5 letter words ---> gives around 400
import miscellaneousWords from "./miscellaneous-words";
import a from "./a";
import s from "./s";

const words = {
  ...a,
  ...s,
  ...miscellaneousWords,
};

const getRandomWord = () => {
  let wordKeys = Object.keys(words);
  let randomIndex = Math.floor(Math.random() * wordKeys.length);
  return wordKeys[randomIndex];
};

const fetchRandomWord = async () => {
  let res;
  try {
  } catch (error) {
    console.error(error);
  }
};

export { fetchRandomWord, getRandomWord as default };
