import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import words from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";

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
  let [word, setWord] = useState("");
  let [board, setBoard] = useState(boardObj);
  let [keyboard, setKeyboard] = useState(keyboardObj);
  let [activeKeys, setActiveKeys] = useState(initialKeyStatuses);

  useEffect(() => {
    // get a random word
    let wordKeys = Object.keys(words);
    let randomIndex = Math.floor(Math.random() * wordKeys.length);
    setWord(wordKeys[randomIndex]);
  }, []);

  useEffect(() => {
    console.log({
      "to cheat": {
        "the word is": word,
      },
    });
  }, [word]);

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
      <Header />
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
      <footer>
        <pre>(to cheat, see the console for the word)</pre>
      </footer>
    </div>
  );
}

export default App;
