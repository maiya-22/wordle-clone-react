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
        vasts: true,
        laids: true,
        gones: true,
        huges: true,
        datas: true,
        thans: true,
        bents: true,
        wifes: true,
        torns: true,
        weaks: true,
        inchs: true,
        lives: true,
        mosts: true,
      };
      return !hash[w];
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

const doesWordExist = (word) => {
  return words.includes(word);
};

const fetchDoesWordExist = (word) => {
  return new Promise((resolve, reject) => {
    resolve(doesWordExist(word));
  });
};

export { fetchRandomWord, doesWordExist, fetchDoesWordExist, words as default };
// console.log(process.env);
// const LAMBDA_URL =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:9000/.netlify/functions/dictionary"
//     : "./netlify/functions/dictionary";
// axios
//   .get(LAMBDA_URL, {
//     proxy: "http://localhost",
//     port: 9000,
//   })
//   .then((res) => {
//     console.log({ res });
//   })
//   .catch(console.error);
