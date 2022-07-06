import { auth, firebaseApp } from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import Avatar from "@mui/material/Avatar";
import { DialogContentText, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as sRef } from "firebase/storage";

const Home = function () {
  const [currentUser, setCurrentUser] = useState({});
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const storage = getStorage();
  const storageRef = sRef(storage, currentUser.uid + "/profile-photo");

  const authenticate = getAuth();
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
    [currentUser, imageURL]
  );

  const handleAvatarSettings = function () {
    setOpen(true);
  };
  const handleClose = function () {
    setOpen(false);
  };
  const handleImageUpload = function (e) {
    uploadBytes(storageRef, e.target.files[0]).then(() => {
      handleClose();
    });
  };
  useEffect(
    function () {
      if (currentUser.uid) {
        getDownloadURL(sRef(storage, currentUser.uid + "/profile-photo")).then(
          function (url) {
            setImageURL(url);
          }
        );
      }
    },
    [handleClose]
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
          <div className="user-info">
            <p>{currentUser?.displayName}</p>
            <Avatar
              onClick={handleAvatarSettings}
              alt={currentUser.displayName}
              src={imageURL}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>User Settings</DialogTitle>
              <DialogContentText>
                <CloseIcon id="close-avatar-settings" onClick={handleClose} />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="upload-profile-photo"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="upload-profile-photo">
                  <Button component="span" variant="outlined">
                    Profile Photo
                  </Button>
                </label>
              </DialogContentText>
            </Dialog>
          </div>
          <Button onClick={logOut} variant="contained">
            Sign Out
          </Button>
        </div>
        <div className="app-choices">
          <Button variant="outlined">To-Do App</Button>
          <Button variant="outlined">Coming Soon</Button>
          <Button variant="outlined">Coming Soon</Button>
          <Button variant="outlined">Coming Soon</Button>
        </div>
      </div>
    );
  }
};

export default Home;
