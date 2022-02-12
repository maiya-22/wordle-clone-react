import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import words from "./data";

import "./App.css";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";

let Guess = () => {
  return {
    letter: null,
    status: null,
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
    row[i] = { letter, status: null };
  });
});

function App() {
  let [board, setBoard] = useState(boardObj);
  let [keys, setKeys] = useState(keyboard);

  useEffect(() => {
    console.log("words", words);
  }, []);

  const handleGuessLetter = (e) => {
    console.log("guess letter");
  };
  const handleGuessWord = (e) => {
    console.log("guess word");
  };
  const handleDeleteLetter = (e) => {
    console.log("delete letter");
  };

  const handleKeyClick = (e) => {
    console.log("key click");
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
                  <button className="Square" key={uuid()}>
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
                    className="Keys__row__key"
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
