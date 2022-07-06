import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useState } from "react";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";

const SignUp = function () {
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [matchPassword, setMatchPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [passMatchVisible, setPassMatchVisible] = useState(false);

  const [fillField, setFillField] = useState(false);

  const navigate = useNavigate();
  const authenticate = getAuth();

  const handleNameRegister = function (e) {
    setCreateName(e.target.value);
  };

  const handleEmailRegister = function (e) {
    setCreateEmail(e.target.value);
  };
  const handlePasswordRegister = function (e) {
    setCreatePassword(e.target.value);
  };
  const handlePasswordMatch = function (e) {
    setMatchPassword(e.target.value);
  };
  const handlePassVisibility = function () {
    setPassVisible(!passVisible);
  };
  const handlePassMatchVisibility = function () {
    setPassMatchVisible(!passMatchVisible);
  };

  const create = async function () {
    if (createPassword === matchPassword) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          createEmail,
          createPassword
        );
        updateProfile(authenticate.currentUser, {
          displayName: createName,
        }).then(function () {
          const db = getDatabase();
          set(ref(db, user.user.uid + "/user"), {
            name: user.user.displayName,
            email: user.user.email,
          }).then(function () {
            Swal.fire({
              icon: "success",
              title: "Account Created",
              text: `Welcome, ${user.user.displayName}`,
            }).then(function (res) {
              if (res.isConfirmed) {
                navigate("/home");
              }
            });
          });
        });
      } catch (error) {
        if (createName === "" || createEmail === "" || createPassword === "") {
          Swal.fire({
            icon: "error",
            text: "Please fill out all the fields",
          }).then(function (res) {
            if (res.isConfirmed) {
              setFillField(true);
            }
          });
        } else if (error.code === "auth/email-already-in-use") {
          Swal.fire({
            icon: "error",
            text: "The e-mail is already in use",
          });
        }
        console.log(error.code);
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Passwords do not match",
      });
    }
  };

  return (
    <div className="signup-container wrapper">
      <div className="create-account-inner">
        <label
          className="sr-only"
          aria-label="Enter your name"
          htmlFor="displayName"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handleNameRegister}
          id="displayName"
          label="Enter your name"
          variant="outlined"
          className={!createName ? `fieldWarn${fillField}` : ""}
        />
        <label
          className="sr-only"
          aria-label="Enter your email"
          htmlFor="newEmail"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handleEmailRegister}
          id="newEmail"
          label="Enter your e-mail"
          variant="outlined"
          className={!createEmail ? `fieldWarn${fillField}` : ""}
        />
        <label
          className="sr-only"
          aria-label="Enter your password"
          htmlFor="newPassword"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handlePasswordRegister}
          id="newPassword"
          label="Enter your password"
          variant="outlined"
          type={passVisible ? "text" : "password"}
          className={!createPassword ? `fieldWarn${fillField}` : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {passVisible ? (
                  <VisibilityIcon onClick={handlePassVisibility} />
                ) : (
                  <VisibilityOffIcon onClick={handlePassVisibility} />
                )}
              </InputAdornment>
            ),
          }}
        />
        <label
          className="sr-only"
          aria-label="Re-enter your password"
          htmlFor="confirmPassword"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handlePasswordMatch}
          disabled={createPassword.length < 6 ? true : false}
          id="confirmPassword"
          label={
            matchPassword.length >= 6 && createPassword !== matchPassword
              ? "Passwords must match"
              : "Confirm your password"
          }
          variant="outlined"
          type={passMatchVisible ? "text" : "password"}
          className={!matchPassword ? `fieldWarn${fillField}` : ""}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {passMatchVisible ? (
                  <VisibilityIcon onClick={handlePassMatchVisibility} />
                ) : (
                  <VisibilityOffIcon onClick={handlePassMatchVisibility} />
                )}
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={create}
          sx={{ margin: "10px 0", backgroundColor: "green" }}
          variant="contained"
        >
          Create Account
        </Button>
        <Link to="/">
          <Button
            className="back-button"
            sx={{ margin: "10px 0" }}
            variant="outlined"
          >
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
