function Instructions(props) {
  return (
    <div className="Instructions">
      <h4>instructions</h4>
      <ul>
        <li>type a word by clicking the keyboard</li>
        <li>click 'enter' to guess your word</li>
        <li>dark green letters are letters that are in the correct position</li>
        <li>
          light green letters are letters that are in the word, but not in the
          correct position
        </li>
        <li>grey letters are not in the word</li>
        <li>
          The api is in progress, so a lot of words are missing. So, you can
          cheat and click the button to see what the word is.
        </li>
      </ul>
    </div>
  );
}

export default Instructions;
