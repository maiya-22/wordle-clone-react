import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { fetchRandomWord } from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";
import Instructions from "./features/instructions/Instructions";

import {
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
  isInWordList,
  getWordFromRow,
  isRowComplete,
  isRowOver,
  getRowAnimationStyles,
  getSquareAnimationStyles,
  isGameOver,
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
  // 7 columns and 5 rows nested array. Each row has an empty guess
  let [board, setBoard] = useState(
    [0, 1, 2, 3, 4, 5].map((y) => {
      return [0, 1, 2, 3, 4].map((x) => {
        // at [ x, y ], you have the emtpy guess:
        return Guess({ letter: null, status: "none" });
      });
    })
  );

  // keyboard rows, each with a 'guess' object, with keyboard letter
  let [keyboard, setKeyboard] = useState(
    [
      "q w e r t y u i o p".split(" "),
      "a s d f g h j k l".split(" "),
      "enter z x c v b n m delete".split(" "),
    ].map((row) => {
      return row.map((key, i) => {
        // at [row][i] you have the guess obj of that key
        return Guess({ letter: key, status: "none" });
      });
    })
  );
  let [state, setState] = useState({
    rowNumber: 0,
    columnNumber: 0,
  });

  // to get to a square:  board[rowNumber][columnNumber]
  let [mode, setMode] = useState("loading");
  let [word, setWord] = useState("... loading word");
  let [showInstructions, setShowInstrutions] = useState(false);
  let [message, setMessage] = useState(
    "Type a word with the keyboard. Press 'enter' to guess."
  );

  useEffect(() => {
    fetchRandomWord()
      .then((word) => {
        setWord(word);
        setMode("init-game");
      })
      .catch(console.error);
  }, []);

  const placeLetterGuess = (params) => {
    // just places the guess in the square. Doesn't evaluate it.
    // and increments to the next position, for the next guess
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
      setMessage(
        `"${getWordFromRow({
          row: board[state.rowNumber],
        })}"  is not yet a complete word`
      );
      console.warn("to do: is complete?");
      return null;
    }
    if (getWordFromRow({ row: board[state.rowNumber] }) === word) {
      setTimeout(() => {
        setMessage("you won!");
        setMode("you-won");
      }, 1000);
    }
    if (!isInWordList({ row: board[state.rowNumber] })) {
      setMode("word-error");
      setMessage(
        `"${getWordFromRow({
          row: board[state.rowNumber],
        })}"  is not yet in the temp list of words`
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
    if (!getWordFromRow({ row: board[state.rowNumber] }) != word) {
      if (isGameOver({ state, board })) {
        setMessage(`game over. word: ${word}`);
        setMode("game-over");
      }
    }
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
    if (mode === "you-won" || mode === "game-over") return null; // no more plays
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
      <Header>
        <span className="Header__message">{message}</span>
        <button
          className="Header__temp-dev-button"
          onClick={(e) => {
            e.preventDefault();
            setShowInstrutions(!showInstructions);
          }}
        >
          instructions
        </button>
        <button
          className="Header__temp-dev-button"
          onClick={(e) => {
            e.preventDefault();
            e.target.innerHTML = `The word is "${word}"`;
          }}
        >
          click to see word
        </button>
      </Header>
      <Board>
        {board.map((row, i) => {
          return (
            <div
              key={uuid()}
              className="Board__row"
              style={getRowAnimationStyles({ mode, state, i })}
            >
              {row.map((guess, k) => {
                return (
                  <button
                    style={getSquareAnimationStyles({ mode, state, i, k })}
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
      {showInstructions && <Instructions />}
      <footer></footer>
    </div>
  );
}

export default App;
