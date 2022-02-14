import axios from "axios";

// temp data:
import a from "./a"; //template string
import s from "./s"; // template string
import one from "./miscellaneous-words"; // arr
import two from "./miscellaneous-words-01"; //template string

const wordsHash = {};

const filterWords = (words) => {
  return words
    .filter((w) => w.length === 5 || (w.length === 4 && w[3] != "s"))
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

let range = words.filter((word) => {
  return (
    word[word.length - 1] === "r" &&
    word[word.length - 2] === "o" &&
    word.includes("e")
  );
});

console.log("range", range);

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
