import React, { useState } from "react";

import { v4 as uuid } from "uuid";

import "./Board.scss";

const Board = function (props) {
  return <div className="Board">{props.children}</div>;
};

export default Board;
