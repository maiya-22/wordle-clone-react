import axios from "axios";

// temp data:
import a from "./a"; //template string
import s from "./s"; // template string
import one from "./miscellaneous-words"; // arr
import two from "./miscellaneous-words-01"; //template string

const wordsHash = {};

const filterWords = (words) => {
  return words
    .filter((w) => w.length === 5 || w.length === 4)
    .map((word) => {
      return word.length === 5 ? word : `${word}s`; //and an s to words w/ 4 letters
    });
};

const transformTemplateStringIntoArray = (string) => {
  return string.split("\n");
};

const words = [
  ...filterWords(transformTemplateStringIntoArray(a)),
  ...filterWords(transformTemplateStringIntoArray(s)),
  ...filterWords(one),
  ...filterWords(transformTemplateStringIntoArray(two)),
];

words.forEach((word) => {
  wordsHash[word] = true;
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
