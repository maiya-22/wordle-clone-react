import axios from "axios";

// temp data:
import a from "./a"; //template string
import s from "./s"; // template string
import one from "./miscellaneous-words"; // arr
import two from "./miscellaneous-words-01"; //template string

const wordsHash = {};

const filterWords = (words) => {
  return words
    .filter(
      (w) => w.length === 5 || (w.length === 4 && w[3] != "s" && w[3] != "y")
    )
    .map((word) => {
      word = word.toLowerCase();
      return word.length === 5 ? word : `${word}s`; //and an s to words w/ 4 letters
    })
    .filter((w) => {
      // temp fix. filter out words that don't make sense w/ the s, etc
      let hash = {
        used: true,
        bushs: true,
        darks: true,
        nices: true,
        ontos: true,
      };
      !hash[w];
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

// fake api request, until api linked
const fetchRandomWord = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(getRandomWord());
    }, 2000);
  });
};

export { fetchRandomWord, getRandomWord, words as default };
