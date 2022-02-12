import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import getRandomWord from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";

import {
  isRoundOver,
  isLetterInRound,
  getLettersInRoundHash,
  updateKeyboardGuessStatuses,
  updateBoardRowStatuses,
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
    [Guess(), Guess(), Guess(), Guess(), Guess()],
    [Guess(), Guess(), Guess(), Guess(), Guess()],
    [Guess(), Guess(), Guess(), Guess(), Guess()],
    [Guess(), Guess(), Guess(), Guess(), Guess()],
    [Guess(), Guess(), Guess(), Guess(), Guess()],
    [Guess(), Guess(), Guess(), Guess(), Guess()],
  ]);
  let [keyboard, setKeyboard] = useState([
    [
      Guess({ letter: "q" }),
      Guess({ letter: "w" }),
      Guess({ letter: "e" }),
      Guess({ letter: "r" }),
      Guess({ letter: "t" }),
      Guess({ letter: "y" }),
      Guess({ letter: "u" }),
      Guess({ letter: "i" }),
      Guess({ letter: "o" }),
      Guess({ letter: "p" }),
    ],
    [
      Guess({ letter: "a" }),
      Guess({ letter: "s" }),
      Guess({ letter: "d" }),
      Guess({ letter: "f" }),
      Guess({ letter: "g" }),
      Guess({ letter: "h" }),
      Guess({ letter: "j" }),
      Guess({ letter: "k" }),
      Guess({ letter: "l" }),
    ],
    [
      Guess({ letter: "enter" }),
      Guess({ letter: "z" }),
      Guess({ letter: "x" }),
      Guess({ letter: "c" }),
      Guess({ letter: "v" }),
      Guess({ letter: "b" }),
      Guess({ letter: "n" }),
      Guess({ letter: "m" }),
      Guess({ letter: "delete" }),
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
    // the array of pending guesses:
    let round = [...board[state.round]];
    // evaluate the guesses and update the board and keys with the status:

    let nextBoardRow = updateBoardRowStatuses({ word, round });
    let nextBoard = [...board];
    nextBoard[state.round] = nextBoardRow;

    let nextKeyboard = updateKeyboardGuessStatuses({
      keyboard,
      round,
    });

    setBoard(nextBoard);
    setKeyboard(nextKeyboard);
    setState({
      ...state,
      round: state.round + 1,
      position: 0,
    });
  };

  const deleteLetter = (props) => {
    let { e } = props;
    console.log("delete letter");
  };

  // see which key was clicked and call move
  const handleKeyClick = (e) => {
    let { dataset } = e.target;
    let { letter, status } = dataset;
    if (letter === "enter") {
      guessWord();
    } else if (letter === "delete") {
      deleteLetter({ e });
    } else {
      guessLetter({ e, letter, status });
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
