import React, { useState } from "react";

import { v4 as uuid } from "uuid";

import "./Keys.scss";

const Keys = function (props) {
  let { keyboard } = props;
  return (
    <div className="Keys">
      {keyboard.map((row) => {
        return (
          <div className="Keys__row" key={uuid()}>
            {row.map((key) => {
              return (
                <button className="Keys__row__key" key={uuid()}>
                  {key.letter}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Keys;
