import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { loginContextObj } from "../LoginContext";

function Header() {
  const { loginStatus, userLogout } = useContext(loginContextObj);

  return (
    <ul className="nav justify-content-end p-3 bg-light">
      {!loginStatus ? (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">Login</NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/register">Register</NavLink>
          </li>
        </>
      ) : (
        <li className="nav-item">
          <NavLink className="nav-link" to="/login" onClick={userLogout}>
            Logout 
          </NavLink>
        </li>
      )}
    </ul>
  );
}

export default Header;
