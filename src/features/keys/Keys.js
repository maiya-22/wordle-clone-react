import React, { useState } from "react";

import { v4 as uuid } from "uuid";

import "./Keys.scss";

const Keys = function (props) {
  return <div className="Keys">{props.children}</div>;
};

export default Keys;
