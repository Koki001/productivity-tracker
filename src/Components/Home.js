import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

const Home = function () {
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  useEffect(
    function () {
      onAuthStateChanged(auth, (current) => {
        setCurrentUser(current);
      });
    },
    [currentUser]
  );
  const handleGoToDo = function () {
    navigate("/home/to-do");
  };
  const handleGoToSpace = function(){
    navigate("/home/space-app")
  }
  if (currentUser === null) {
    Swal.fire({
      icon: "error",
      title: "Hmmm...",
      text: "Looks like you are not signed in",
    }).then(function (res) {
      if (res.isConfirmed) {
        navigate("/");
      }
    });
  } else if (currentUser.email) {
    return (
      <div className="home-container wrapper">
        <div className="app-choices">
          <Button onClick={handleGoToDo} variant="outlined">
            To-Do App
          </Button>
          <Button onClick={handleGoToSpace} variant="outlined">
            Space App
          </Button>
          <Button disabled={true} variant="outlined">
            Coming Soon
          </Button>
          <Button disabled={true} variant="outlined">
            Coming Soon
          </Button>
        </div>
      </div>
    );
  }
};

export default Home;
