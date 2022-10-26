import React from "react";
import { useState } from "react";
import "./signup.css";
// import M from "materialize-css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const postData = (e) => {
    e.preventDefault();
    if (!email || !name || !password) {
      alert("invalid email");
      return;
    }
    // console.log(name, email, password);
    fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          navigate("/login");
        }
      })
      .catch((err) => alert("not ready", err));

    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="signup">
      <h1 className="head">Sign up</h1>
      <form>
        <label htmlFor="">Name</label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type={"text"}
        />
        <br />
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
        <a href="/login">Already have an account ?</a>
        <br />
        <button onClick={postData} className="signup-button">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
