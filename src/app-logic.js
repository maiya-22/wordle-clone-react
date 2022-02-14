import { keyboard } from "@testing-library/user-event/dist/keyboard";
import words from "./data";

// make a hash out of the letters played in the last round, to easily get their status
// eg { "s": { letter: "s", status: "exact"}} for letters in round

const isGameOver = (params) => {
  let { board, state } = params;
  return state.rowNumber + 1 === board.length;
};

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

const getKeyAnimationStyles = (params) => {
  let { mode, key } = params;
  if (mode != "guessing" || mode != "game-over") {
    return {};
  }
  switch (key.status) {
    case "exact":
      return {
        animation: `fadeUp 2s forwards ease-in-out`,
      };
    case "almost":
      return {
        animation: `fadeUp 1s forwards ease-in-out`,
      };
    case "no-match":
      return {
        animation: `fadeUp 0s forwards ease-in-out`,
      };
    default:
      return {};
  }
};

const getRowAnimationStyles = (params) => {
  let { mode, state, i } = params; //i is the index of the row

  if (mode === "word-error" && state.rowNumber === i) {
    return {
      animation: `headShake 1s  0s forwards ease-in-out`,
    };
  }
  return {};
};

const getSquareAnimationStyles = (params) => {
  let { mode, state, i, k } = params; //i is the index of the row. k is the index of the column

  if (mode === "you-won" && state.rowNumber - 1 === i) {
    return {
      animation: `tada 1s  ${k / 20}s forwards ease-in-out`,
    };
  }

  if (mode === "init-game") {
    return {
      opacity: 0,
      animation: `fadeIn 3s  0.1s  forwards ease-out`,
    };
  }
  // ... loading word
  let delay;
  if (mode === "loading") {
    delay = i / k === "Infinity" ? 0.2 : i / k;
    delay = delay === 0 ? 0.2 : delay;
    if (k === 0) {
      delay = (i / 1) * 1.5;
    }
    return {
      backfaceVisibility: "visible !important",
      opacity: 0.25,
      animation: `loading 1s  ${delay}s infinite`,
    };
  }

  // ... when the word is being guessed
  if (
    i === state.rowNumber - 1 &&
    (mode === "guessing" || mode === "game-over")
  ) {
    return {
      backfaceVisibility: "visible !important",
      opacity: 0,
      animation: `flipInX 1s  ${k * 0.25}s forwards`,
    };
  }

  // idle:
  return {};
};

export {
  isRowOver,
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
  isRowComplete,
  isInWordList,
  getWordFromRow,
  getRowAnimationStyles,
  getSquareAnimationStyles,
  getKeyAnimationStyles,
  isGameOver,
};
