import "./Header.scss";
import { gitHubImg } from "../../data/urls";
const Header = function () {
  return (
    <header className="Header">
      <InProgress />
      <GitHubLink />
    </header>
  );
};

export default Header;

function InProgress() {
  return (
    <img
      style={{ width: "7.2vw", height: "7vw" }}
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYcZvFN2V_DqmtZnCpJM-zDwHQSFq8Xtbdww&usqp=CAU"
      alt="in progress"
    />
  );
}

function GitHubLink() {
  return (
    <a href="https://github.com/maiya-22/wordle-clone-react" target="_blank">
      <img style={{ width: "6.5vw" }} src={gitHubImg} alt="link to repo" />
    </a>
  );
}
