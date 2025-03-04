import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/">
          <img src="/images/pexels-pixabay-271618.jpg" alt="Logo" />
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
