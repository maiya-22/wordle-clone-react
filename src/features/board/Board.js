import React, { useState } from "react";

import { v4 as uuid } from "uuid";

import "./Board.scss";

const Board = function (props) {
  let { board } = props;

  return (
    <div className="Board">
      {board.map((row, i) => {
        return (
          <div key={uuid()} className="Board__row">
            {row.map((guess, k) => {
              return <Square key={uuid()} guess={board[i][k]} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;

function Square(props) {
  let { guess } = props;
  return <button className="Square">{guess.letter || "*"}</button>;
}
