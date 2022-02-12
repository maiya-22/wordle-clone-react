import React, { useState } from "react";

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

  return (
    <div className="App">
      <div className="Header"></div>
      <Board board={board} />
      <Keys keyboard={keyboard} />
    </div>
  );
}

export default App;
