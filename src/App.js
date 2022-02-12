import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import getRandomWord from "./data";
import "./App.scss";
import Board from "./features/board/Board";
import Keys from "./features/keys/Keys";
import Header from "./features/header/Header";

let Guess = (params = {}) => {
  return {
    letter: params.letter || null,
    status: params.status || "none",
  };
};

// hard coded game objects, for making it easier to visualize what is happening:

function App() {
  let [state, setState] = useState({
    round: 0,
    position: 0,
  });
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
    // get a random word
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
    let roundLength = board[0].length;

    if (position >= roundLength) {
      console.warn("end of round");
      // vis warn
      return null;
    }
    // put the pending guess in the square:
    nextBoard[round][position] = Guess({ letter, status: "pending" });
    // update board, with new guess
    setBoard(nextBoard);
    setState({ ...state, position: state.position + 1 });
  };
  const guessWord = () => {
    // the array of guesses:
    let round = [...board[state.round]];
    // evaluate the guesses and update the board and keys:
    updateBoardSquaresStatus();
    updateKeysStatus();
    // set state for next round
    setState({
      ...state,
      round: state.round + 1,
      position: 0,
    });

    // the board squares change color based on this round's guess
    function updateBoardSquaresStatus() {
      let nextBoardRow = round.map((letterGuess, i) => {
        let guess = { ...letterGuess };
        let guessedLetter = guess.letter;
        let status = "no-match";
        let isGuessedLetterAlmostMatch = word.split("").includes(guessedLetter);
        status = isGuessedLetterAlmostMatch ? "almost" : status;
        let isGuessedLetterExactMatch = guessedLetter === word[i];
        status = isGuessedLetterExactMatch ? "exact" : status;
        letterGuess.status = status;
        return letterGuess;
      });
      let nextBoard = [...board];

      nextBoard[state.round] = nextBoardRow;
      setBoard(nextBoard);
    }

    // they keys change color, but maintain status from previous rounds
    function updateKeysStatus() {
      let lettersInRound = round.reduce((hash, guess) => {
        hash[guess.letter] = guess;
        return hash;
      }, {});

      let nextKeyboard = [...keyboard].map((row) => {
        return row.map((guess) => {
          let { letter, status } = guess;
          let isLetterInRound = !!lettersInRound[guess.letter];
          if (!isLetterInRound) {
            // do nothing
          } else if (status === "exact") {
            // do nothing
          } else if (lettersInRound[letter].status === "exact") {
            guess.status = "exact";
          } else if (status === "almost") {
            // do nothing
          } else if (lettersInRound[letter].status === "almost") {
            guess.status = "almost";
          } else {
            guess.status = "no-match";
          }
          return guess;
        });
      });

      setKeyboard(nextKeyboard);
    }
  };
  const deleteLetter = (props) => {
    let { e } = props;
    console.log("delete letter");
  };

  // figure out which key was clicked and call move
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
                let keyStatus = key.status;
                return (
                  <button
                    data-letter={key.letter}
                    data-status={keyStatus}
                    className={`Keys__row__key ${keyStatus}`}
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
