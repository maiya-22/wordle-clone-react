import words from "./data";

// make a hash out of the letters played in the last round, to easily get their status
// eg { "s": { letter: "s", status: "exact"}} for letters in round

const getWordFromRow = (params) => {
  let { row } = params;
  return row
    .map((guess) => {
      return guess.letter;
    })
    .join("");
};

const isInWordList = (params) => {
  let { row } = params;
  let word = getWordFromRow({ row });
  return words.includes(word);
};

const getLettersInRowHash = (params) => {
  let { row } = params;
  return row.reduce((hash, guess) => {
    hash[guess.letter] = guess;
    return hash;
  }, {});
};

// they keys change color, but maintain status from previous rounds
const updateKeyboardGuessStatuses = (params) => {
  let { keyboard, row } = params;

  let lettersInRowHash = getLettersInRowHash({ row });
  // update they keyboard keys' statuses:
  return [...keyboard].map((row) => {
    return row.map((guess) => {
      if (!lettersInRowHash[guess.letter]) {
        // letter was not played this round, do nothing
      } else if (guess.status === "exact") {
        // a previous match was as close, or closer than current match, do nothing
      } else if (lettersInRowHash[guess.letter].status === "exact") {
        guess.status = "exact";
      } else if (guess.status === "almost") {
        // previous match was as close, or closer than current match, do nothing
      } else if (lettersInRowHash[guess.letter].status === "almost") {
        guess.status = "almost";
      } else {
        guess.status = "no-match";
      }
      return guess;
    });
  });
};

const isRowOver = (params) => {
  let { state, board } = params;
  let rowLength = board[0].length;
  return state.columnNumber >= rowLength;
};

const isRowComplete = (params) => {
  let { row } = params;
  return row.reduce((isComplete, guess) => {
    return isComplete && !!guess.letter;
  }, true);
};

// the board squares change color based on this round's guess
const updateBoardRowStatuses = (params) => {
  let { word, row } = params;
  return row.map((guess, i) => {
    if (guess.letter === word[i]) {
      guess.status = "exact"; // exact match
    } else if (word.split("").includes(guess.letter)) {
      guess.status = "almost"; // letter is in the word, but not at that position
    } else {
      guess.status = "no-match"; // not a match
    }
    return guess;
  });
};

export {
  isRowOver,
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
  isRowComplete,
  isInWordList,
  getWordFromRow,
};
