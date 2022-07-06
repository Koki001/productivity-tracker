import { auth, firebaseApp } from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

const Home = function () {
  const [currentUser, setCurrentUser] = useState({});

  const database = getDatabase(firebaseApp);

  const navigate = useNavigate();
  const logOut = async function () {
    setCurrentUser({});
    await signOut(auth).then(function () {
      navigate("/");
    });
  };

  useEffect(
    function () {
      onAuthStateChanged(auth, (current) => {
        setCurrentUser(current);
      });
      if (currentUser?.uid) {
        const dbRef = ref(database, `${currentUser.uid}`);
        get(dbRef).then(function (res) {});
      }
    },
    [currentUser]
  );
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
        <div className="logged-as">
          <p>Current user: {currentUser?.displayName}</p>
          <Button onClick={logOut} variant="contained">
            Sign Out
          </Button>
        </div>

        <h1>HOME PAGE</h1>
      </div>
    );
  }
};

export default Home;
