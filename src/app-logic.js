// make a hash out of the letters played in the last round, to easily get their status
// eg { "s": { letter: "s", status: "exact"}} for letters in round

const getLettersInRoundHash = (params) => {
  let { round } = params;
  return round.reduce((hash, guess) => {
    hash[guess.letter] = guess;
    return hash;
  }, {});
};

const isRoundOver = (params) => {
  let { state, board } = params;
  let roundLength = board[0].length;
  return state.position >= roundLength;
};

const isLetterInRound = (params) => {
  let { state, board, guess } = params;
  let round = board[state.round];

  return round.includes(guess.letter);
};

// the board squares change color based on this round's guess
const updateBoardRowStatuses = (params) => {
  let { word, round } = params;

  return round.map((guess, i) => {
    let status;
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

// they keys change color, but maintain status from previous rounds
const updateKeyboardGuessStatuses = (params) => {
  let { keyboard, round } = params;

  let lettersInRound = getLettersInRoundHash({ round });
  return [...keyboard].map((row) => {
    return row.map((guess) => {
      let { letter, status } = guess;
      let isLetterInRound = !!lettersInRound[guess.letter];
      if (!isLetterInRound) {
        // letter was not played this round, do nothing
      } else if (status === "exact") {
        // a previous match was as close, or closer than current match, do nothing
      } else if (lettersInRound[letter].status === "exact") {
        guess.status = "exact";
      } else if (status === "almost") {
        // previous match was as close, or closer than current match, do nothing
      } else if (lettersInRound[letter].status === "almost") {
        guess.status = "almost";
      } else {
        guess.status = "no-match";
      }
      return guess;
    });
  });
};

export {
  isRoundOver,
  isLetterInRound,
  getLettersInRoundHash,
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
};
