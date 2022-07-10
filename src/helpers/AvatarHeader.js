import { auth, firebaseApp } from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { DialogContentText, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as sRef } from "firebase/storage";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

const AvatarHeader = function () {
  const [currentUser, setCurrentUser] = useState({});
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const storage = getStorage();

  const database = getDatabase(firebaseApp);

  const navigate = useNavigate();
  const location = useLocation();
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
    const storageRef = sRef(storage, currentUser.uid + "/profile-photo");
    uploadBytes(storageRef, e.target.files[0]).then((url) => {
      updateProfile(auth.currentUser, {
        photoURL: url.metadata.fullPath,
      }).then(function () {
        getDownloadURL(sRef(storage, currentUser.uid + "/profile-photo"))
          .then(function (url) {
            setImageURL(url);
          })
          .then(function () {
            handleClose();
          });
      });
    });
  };
  useEffect(
    function () {
      if (currentUser.photoURL) {
        getDownloadURL(sRef(storage, currentUser.uid + "/profile-photo")).then(
          function (url) {
            setImageURL(url);
          }
        );
      }
    },
    [currentUser]
  );
  const quickLinkHome = function (e) {
    e.preventDefault();
    navigate("/home");
  };
  const quickLinkToDo = function (e) {
    e.preventDefault();
    navigate("/home/to-do");
  };
    const quickLinkSpaceApp = function (e) {
      e.preventDefault();
      navigate("/home/space-app");
    };
  // console.log(location.pathname)
  return (
    <div className="logged-as">
      <div className="user-info">
        {/* <p>{currentUser?.displayName}</p> */}
        <Avatar
          onClick={handleAvatarSettings}
          alt={currentUser?.displayName}
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
      <div className="quick-links">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            sx={
              location.pathname === "/home"
                ? { borderBottom: "3px solid gray" }
                : null
            }
            onClick={quickLinkHome}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            sx={
              location.pathname === "/home/to-do"
                ? { borderBottom: "3px solid gray" }
                : null
            }
            onClick={quickLinkToDo}
          >
            To-Do
          </Link>
          <Link onClick={quickLinkSpaceApp} underline="hover" color="inherit">
            Space App
          </Link>
          <Link underline="hover" color="inherit">
            Coming Soon
          </Link>
          <Link underline="hover" color="inherit">
            Coming Soon
          </Link>
        </Breadcrumbs>
      </div>
      <Button onClick={logOut} variant="contained">
        Sign Out
      </Button>
    </div>
  );
};

export default AvatarHeader;
