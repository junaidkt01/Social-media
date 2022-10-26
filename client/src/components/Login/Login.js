import React, { useContext, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";

const Login = () => {
  const { state, dispatch } = useContext(userContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getUser = (e) => {
    e.preventDefault();
    fetch("/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type:"USER", payload:data.user})
          alert(data.message);
          navigate("/");
        }
      })
      .catch((err) => alert("not ready", err));
  };
  return (
    <div className="login">
      <h1 className="head">Login</h1>
      <form>
        <label htmlFor="">Email</label> <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"email"}
        />
        <br />
        <label htmlFor="">Password</label> <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={"password"}
        />
        <br />
        <a href="/signup">Did'nt have an account ?</a>
        <br />

        <button onClick={getUser} className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
