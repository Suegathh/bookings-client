import "./Header.scss";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <header className="main-header">
      <div className="container">
        <Link to="/">
          <h1 className="logo">Sand Dunes Villa</h1>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/rooms">Rooms</Link>

          {user ? (
            <>
              <span>Welcome, {user.name}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
