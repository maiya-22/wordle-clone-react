import "./Header.scss";
import { gitHubImg } from "../../data/urls";
const Header = function (props) {
  return (
    <header className="Header">
      <GitHubLink />
      {props.children}
    </header>
  );
};

export default Header;

function GitHubLink() {
  return (
    <a
      className="Header__git-link"
      href="https://github.com/maiya-22/wordle-clone-react"
      target="_blank"
    >
      <img style={{ width: "6.5vw" }} src={gitHubImg} alt="link to repo" />
    </a>
  );
}
