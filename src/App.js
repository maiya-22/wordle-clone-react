import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { getRandomWord } from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";

import {
  isRoundOver,
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
  isRoundComplete,
  isInWordList,
  getWordFromRound,
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
    round: 0, // round is a row in the game  evaluate a round when you click "enter"
    position: 0, // position is the column    board[round][position] ---> points to a square
  });
  // e.g. board[i][k] is like board[round][position]

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

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(() => {
    console.log({
      "to cheat": {
        "the word is": word,
      },
    });
  }, [word]);

  const guessLetter = (params) => {
    // just places the guess in the square. Doesn't evaluate it.
    // and increments to the next position, for the next guess
    //  to do: error check, if round is over when try to guess a letter
    let { letter } = params;
    let { round, position } = state;
    let nextBoard = [...board];

    if (isRoundOver({ state, board })) {
      return null;
    }
    // put the pending guess in the square:
    nextBoard[round][position] = Guess({ letter, status: "pending" });
    // update board, with new guess
    setBoard(nextBoard);
    // move to the next position/ie letter to guess
    setState({ ...state, position: state.position + 1 });
  };

  const guessWord = () => {
    // evaluate the letters in the array to see which match the word
    // update the board, so that the guesses are color coded, if they match
    // update the keyboard, for any new keys that were matched and/or tried, etc

    if (!isRoundComplete({ round: board[state.round] })) {
      console.warn("to do: is complete?");
      return null;
    }

    if (!isInWordList({ round: board[state.round] })) {
      console.warn(
        `${getWordFromRound({
          round: board[state.round],
        })} is not in words list`
      );
      return null;
    }

    let nextBoard = [...board];
    let updatedRound = updateBoardRowStatuses({
      word,
      round: board[state.round],
    });
    nextBoard[state.round] = updatedRound;

    let nextKeyboard = updateKeyboardGuessStatuses({
      keyboard,
      round: updatedRound,
    });

    setBoard(nextBoard);
    setKeyboard(nextKeyboard);
    setState({
      round: state.round + 1,
      position: 0,
    });
  };

  const deleteLetter = () => {
    if (state.position <= 0) return null;
    let emptyGuess = Guess({ letter: null, status: "none" });
    let nextBoard = [...board];
    nextBoard[state.round][state.position - 1] = emptyGuess;
    setState({
      ...state,
      position: state.position - 1,
    });
    setBoard(nextBoard);
  };

  // see which key was clicked and call move
  const handleKeyClick = (e) => {
    let { dataset } = e.target;
    let { letter, status } = dataset;
    if (letter === "enter") {
      guessWord();
    } else if (letter === "delete") {
      deleteLetter();
    } else {
      guessLetter({ letter, status });
    }
  };

  return (
    <div className="App">
      <Header />
      <Board>
        {board.map((row, i) => {
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
