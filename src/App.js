import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { getRandomWord } from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";

import {
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
  isInWordList,
  getWordFromRow,
  isRowComplete,
  isRowOver,
  getErrorAnimationStyles,
  getAppearAnimationStyles,
} from "./app-logic";

// the guess.status is used as a className, to color the squares and keys
// the letter renders in square and key divs
let Guess = (params = {}) => {
  return {
    letter: params.letter || null,
    status: params.status || "none",
  };
};

function App() {
  let [state, setState] = useState({
    rowNumber: 0,
    columnNumber: 0,
  });
  // to get to a square:  board[rowNumber][columnNumber]

  let [mode, setMode] = useState("idle");
  let [word, setWord] = useState("");
  let [board, setBoard] = useState([
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
    [
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
      Guess({ letter: null, status: "none" }),
    ],
  ]);
  let [keyboard, setKeyboard] = useState([
    [
      Guess({ letter: "q", status: "none" }),
      Guess({ letter: "w", status: "none" }),
      Guess({ letter: "e", status: "none" }),
      Guess({ letter: "r", status: "none" }),
      Guess({ letter: "t", status: "none" }),
      Guess({ letter: "y", status: "none" }),
      Guess({ letter: "u", status: "none" }),
      Guess({ letter: "i", status: "none" }),
      Guess({ letter: "o", status: "none" }),
      Guess({ letter: "p", status: "none" }),
    ],
    [
      Guess({ letter: "a", status: "none" }),
      Guess({ letter: "s", status: "none" }),
      Guess({ letter: "d", status: "none" }),
      Guess({ letter: "f", status: "none" }),
      Guess({ letter: "g", status: "none" }),
      Guess({ letter: "h", status: "none" }),
      Guess({ letter: "j", status: "none" }),
      Guess({ letter: "k", status: "none" }),
      Guess({ letter: "l", status: "none" }),
    ],
    [
      Guess({ letter: "enter", status: "none" }),
      Guess({ letter: "z", status: "none" }),
      Guess({ letter: "x", status: "none" }),
      Guess({ letter: "c", status: "none" }),
      Guess({ letter: "v", status: "none" }),
      Guess({ letter: "b", status: "none" }),
      Guess({ letter: "n", status: "none" }),
      Guess({ letter: "m", status: "none" }),
      Guess({ letter: "delete", status: "none" }),
    ],
  ]);

  // console.log(process.env);

  const LAMBDA_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/dictionary"
      : "./netlify/functions/dictionary";

  useEffect(() => {
    setWord(getRandomWord());
    // axios
    //   .get(LAMBDA_URL, {
    //     proxy: "http://localhost",
    //     port: 9000,
    //   })
    //   .then((res) => {
    //     console.log({ res });
    //   })
    //   .catch(console.error);
  }, []);

  useEffect(() => {
    console.log("the word is", `"${word}"`);
  }, [word]);

  const placeLetterGuess = (params) => {
    // just places the guess in the square. Doesn't evaluate it.
    // and increments to the next position, for the next guess
    //  to do: error check, if round is over when try to guess a letter
    let { letter } = params;
    let { rowNumber, columnNumber } = state;
    let nextBoard = [...board];

    if (isRowOver({ state, board })) {
      return null;
    }
    // put the pending guess in the square:
    nextBoard[rowNumber][columnNumber] = Guess({ letter, status: "pending" });
    // update board, with new guess
    setBoard(nextBoard);
    // move to the next position/ie letter to guess
    setState({
      ...state,
      columnNumber: state.columnNumber + 1,
    });
  };

  const guessWord = () => {
    // evaluate the letters in the array to see which match the word
    // update the board, so that the guesses are color coded, if they match
    // update the keyboard, for any new keys that were matched and/or tried, etc

    if (!isRowComplete({ row: board[state.rowNumber] })) {
      setMode("word-error");
      console.warn("to do: is complete?");

      return null;
    }

    if (!isInWordList({ row: board[state.rowNumber] })) {
      setMode("word-error");
      console.warn(
        `${getWordFromRow({
          row: board[state.rowNumber],
        })} is not in words list`
      );
      return null;
    }

    let nextBoard = [...board];
    let updatedRow = updateBoardRowStatuses({
      word,
      row: board[state.rowNumber],
    });
    nextBoard[state.rowNumber] = updatedRow;

    let nextKeyboard = updateKeyboardGuessStatuses({
      keyboard,
      row: updatedRow,
    });

    setBoard(nextBoard);
    setKeyboard(nextKeyboard);
    setState({
      rowNumber: state.rowNumber + 1,
      columnNumber: 0,
    });
  };

  const deleteLetter = () => {
    if (state.columnNumber <= 0) return null;
    let emptyGuess = Guess({ letter: null, status: "none" });
    let nextBoard = [...board];
    nextBoard[state.rowNumber][state.columnNumber - 1] = emptyGuess;
    setState({
      ...state,
      columnNumber: state.columnNumber - 1,
    });
    setBoard(nextBoard);
  };

  // see which key was clicked and call move
  const handleKeyClick = (e) => {
    let { dataset } = e.target;
    let { letter } = dataset;
    if (letter === "enter") {
      setMode("guessing");
      guessWord();
    } else if (letter === "delete") {
      if (mode != "idle") setMode("idle");
      deleteLetter();
    } else {
      if (mode != "idle") setMode("idle");
      placeLetterGuess({ letter });
    }
  };

  // Board and Keys are wrapper components. They import styles, etc. But logic done here in main App.
  return (
    <div className="App">
      <Header />
      <Board>
        {board.map((row, i) => {
          return (
            <div
              key={uuid()}
              className="Board__row"
              style={getErrorAnimationStyles({ mode, state, i })}
            >
              {row.map((guess, k) => {
                return (
                  <button
                    style={getAppearAnimationStyles({ mode, state, i, k })}
                    className={`Square ${guess.status}`}
                    key={uuid()}
                  >
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
                return (
                  <button
                    data-letter={key.letter}
                    data-status={key.status}
                    className={`Keys__row__key ${key.status}`}
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
