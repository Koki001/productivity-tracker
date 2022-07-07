import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import SignUp from "./Components/SignUp";
import Home from "./Components/Home";
import ToDo from "./ToDoApp/ToDo";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AvatarHeader from "./helpers/AvatarHeader";

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const location = useLocation();

  useEffect(function () {
    if (location.pathname === "/" || location.pathname === "/signup") {
      setLoggedIn(null);
      signOut(auth);
    }
    onAuthStateChanged(auth, (current) => {
      setLoggedIn(current);
    });
  }, []);

  return (
    <div className="app-container">
      {loggedIn !== null && <AvatarHeader />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/to-do" element={<ToDo />} />
      </Routes>
    </div>
  );
}

export default App;
