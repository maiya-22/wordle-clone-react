import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import words from "./data";

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

const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
];

keyboard.forEach((row) => {
  row.forEach((letter, i) => {
    row[i] = { letter, status: "none" };
  });
});

function App() {
  let [state, setState] = useState({
    round: 0,
    position: 0,
  });
  let [board, setBoard] = useState(boardObj);
  let [keys, setKeys] = useState(keyboard);

  useEffect(() => {
    console.log("words", words);
  }, []);

  const guessLetter = (props) => {
    let { e, letter, status } = props;
    let { round, position } = state;
    let nextBoard = [...board];
    nextBoard[round][position] = "test";
    console.log("nextBoard", nextBoard);
    setBoard(nextBoard);
  };
  const guessWord = (props) => {
    let { e, letter, status } = props;
    console.log("guess word", letter, status);
  };
  const deleteLetter = (props) => {
    let { e } = props;
    console.log("delete letter");
  };

  const handleKeyClick = (e) => {
    let { dataset } = e.target;
    let { letter, status } = dataset;
    if (letter === "enter") {
      guessWord({ e, letter, status });
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
      <div className="Header"></div>
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
    </div>
  );
}

export default App;
