import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import words from "./data";
import { gitHubImg } from "./data/urls";

import "./App.css";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";

let Guess = () => {
  return {
    letter: null,
    status: "none",
  };
};

const boardObj = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

boardObj.forEach((row) => {
  row.forEach((guess, i) => {
    row[i] = Guess();
  });
});

let keyboardObj = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
];

keyboardObj.forEach((row) => {
  row.forEach((letter, i) => {
    row[i] = { letter, status: "none" };
  });
});

let initialKeyStatuses = keyboardObj.reduce((hash, row) => {
  row.forEach((letterObj) => {
    hash[letterObj.letter] = {
      letter: letterObj.letter,
      status: "pending",
    };
  });
  return hash;
}, {});

function App() {
  let [state, setState] = useState({
    round: 0,
    position: 0,
  });
  let [word, setWord] = useState("acres");
  let [board, setBoard] = useState(boardObj);
  let [keyboard, setKeyboard] = useState(keyboardObj);
  let [activeKeys, setActiveKeys] = useState(initialKeyStatuses);

  useEffect(() => {}, [activeKeys]);

  const guessLetter = (props) => {
    let { e, letter, status } = props;
    let { round, position } = state;
    let nextBoard = [...board];
    let roundLength = board[0].length;

    if (position >= roundLength) {
      console.warn("end of round");
      // vis warn
      return null;
    }
    nextBoard[round][position] = { letter, status: "pending" };
    setBoard(nextBoard);
    setState({ ...state, position: state.position + 1 });
  };
  const guessWord = (props) => {
    let round = [...board[state.round]];
    updateBoardSquaresStatus();
    updateKeysStatus();
    setState({
      ...state,
      round: state.round + 1,
      position: 0,
    });

    function updateBoardSquaresStatus() {
      let nextBoardRow = round.map((letterGuess, i) => {
        let guess = { ...letterGuess };
        let guessedLetter = guess.letter;
        let status = "no-match";
        let isGuessedLetterAlmostMatch = word.split("").includes(guessedLetter);
        status = isGuessedLetterAlmostMatch ? "almost" : status;
        let isGuessedLetterExactMatch = guessedLetter === word[i];
        status = isGuessedLetterExactMatch ? "exact" : status;
        letterGuess.status = status;
        return letterGuess;
      });
      let nextBoard = [...board];

      nextBoard[state.round] = nextBoardRow;
      setBoard(nextBoard);
    }
    function updateKeysStatus() {
      let nextActiveKeys = { ...activeKeys };
      round.forEach((letterGuess) => {
        let previousLetterGuessStatus =
          nextActiveKeys[letterGuess.letter].status;
        let currentLetterGuessStatus = letterGuess.status;
        if (previousLetterGuessStatus === "exact") {
          // do nothing
        } else if (currentLetterGuessStatus === "exact") {
          nextActiveKeys[letterGuess.letter].status = "exact";
        } else if (previousLetterGuessStatus === "almost") {
          // do nothing
        } else if (currentLetterGuessStatus === "almost") {
          nextActiveKeys[letterGuess.letter].status = "almost";
        } else {
          nextActiveKeys[letterGuess.letter].status = "no-match";
        }
      });
      setActiveKeys(nextActiveKeys);
    }
  };
  const deleteLetter = (props) => {
    let { e } = props;
    console.log("delete letter");
  };

  const handleKeyClick = (e) => {
    let { dataset } = e.target;
    let { letter, status } = dataset;
    if (letter === "enter") {
      guessWord();
      return null;
    } else if (letter === "delete") {
      deleteLetter({ e });
      return null;
    } else {
      guessLetter({ e, letter, status });
    }
  };

  return (
    <div className="App">
      <header className="Header">
        <InProgress />
        <GitHubLink />
      </header>
      <Board>
        {boardObj.map((row, i) => {
          return (
            <div key={uuid()} className="Board__row">
              {row.map((guess, k) => {
                return (
                  <button className={`Square ${guess.status}`} key={uuid()}>
                    {guess.letter || "*"}
                  </button>
                );
              })}
            </div>
          );
        })}
      </Board>
      <Keys>
        {keyboard.map((row) => {
          return (
            <div className="Keys__row" key={uuid()}>
              {row.map((key) => {
                let keyStatus = activeKeys[key.letter].status;
                return (
                  <button
                    data-letter={key.letter}
                    data-status={keyStatus}
                    className={`Keys__row__key ${keyStatus}`}
                    onClick={handleKeyClick}
                    key={uuid()}
                  >
                    {key.letter}
                  </button>
                );
              })}
            </div>
          );
        })}
      </Keys>
    </div>
  );
}

export default App;

// TEMP LINKS:

function InProgress() {
  return (
    <img
      style={{ width: "7.2vw", height: "7vw" }}
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYcZvFN2V_DqmtZnCpJM-zDwHQSFq8Xtbdww&usqp=CAU"
      alt="in progress"
    />
  );
}

function GitHubLink() {
  return (
    <a href="https://github.com/maiya-22/wordle-clone-react" target="_blank">
      <img style={{ width: "6.5vw" }} src={gitHubImg} alt="link to repo" />
    </a>
  );
}
