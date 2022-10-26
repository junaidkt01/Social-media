import "./App.css";
import Home from "./components/Home/Home";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Post from "./components/Post/Post";
import { createContext, useContext, useEffect, useReducer } from "react";
import { initalState, reducer } from "./reducers/userReducer";
import UserProfile from "./components/UserProfile/UserProfile";

export const userContext = createContext();
const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(userContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // if (!user) {
    //   navigate("/signup");
    // } else {
    //   dispatch({ type: "USER", payload: user });
    //   // navigate("/");
    // }
    if (user) dispatch({ type: "USER", payload: user });
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/post" element={<Post />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
    </Routes>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initalState);
  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
