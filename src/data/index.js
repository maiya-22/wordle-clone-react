import axios from "axios";
// filtering out non-5 letter words ---> gives around 400
import miscellaneousWords from "./miscellaneous-words";
import a from "./a";
import s from "./s";

const words = Object.keys({
  ...a,
  ...s,
  ...miscellaneousWords,
});

const getRandomWord = () => {
  let randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

const fetchRandomWord = async () => {
  let res;
  try {
  } catch (error) {
    console.error(error);
  }
};

export { fetchRandomWord, getRandomWord, words as default };
