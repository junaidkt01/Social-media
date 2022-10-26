import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import "./Navbar.css";

const Navbar = () => {
  const [navMenu, setNavMenu] = useState(false);
  const { state, dispatch } = useContext(userContext);
  console.log("state ==> ", state);

  const RenderList = () => {
    const navigate = useNavigate();
    if (state) {
      return [
        <a href="/profile">Profile</a>,
        <a href="/post">Post</a>,
        <a
          href=""
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            navigate("/signup");
          }}
        >
          Sign out
        </a>,
      ];
    } else {
      return [<a href="/login">Login</a>, <a href="/signup">Signup</a>];
    }
  };

  function navMenuHandle(e) {
    e.preventDefault();
    setNavMenu(!navMenu);
  }
  return (
    <div className="navbar">
      <div className="nav">
        <div className="logo">
          <h1>
            <a href={state ? "/" : "/login"}>
              Social
            </a>
          </h1>
        </div>
        <div className="links">
          <RenderList />
        </div>
        <div className="menu-button">
          <i
            onClick={navMenuHandle}
            className="menu-icon"
            class="fa-solid fa-bars"
          ></i>
          {navMenu && (
            <div className="menu-links">
              <RenderList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
