import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LandingPage = function () {
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const [passVisible, setPassVisible] = useState(false);

  const navigate = useNavigate();

  const login = async function () {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        logInEmail,
        logInPassword
      );
      Swal.fire({
        text: `Welcome back, ${user.user.displayName} :)`,
        timer: 1000,
      }).then(function () {
        navigate("/home");
      });
    } catch (error) {
      if (logInEmail === "" || logInPassword === "") {
        Swal.fire({
          icon: "error",
          text: "Please fill out your email and password",
        });
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        Swal.fire({
          icon: "error",
          text: "User not found",
        });
      } else if (error.message === "Firebase: Error (auth/wrong-password).") {
        Swal.fire({
          icon: "error",
          text: "Wrong password",
        });
      }
    }
  };
  const handleEmailChange = function (e) {
    setLogInEmail(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setLogInPassword(e.target.value);
  };
  const handlePassVisibility = function () {
    setPassVisible(!passVisible);
  };

  return (
    <div className="landing-page wrapper">
      <h3>Already have an account?</h3>
      <div className="login-container">
        <label
          className="sr-only"
          aria-label="Enter your email"
          htmlFor="userEmail"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handleEmailChange}
          id="userEmail"
          label="Enter your email"
          variant="outlined"
        />
        <label
          className="sr-only"
          aria-label="Enter your password"
          htmlFor="userPassword"
        />
        <TextField
          sx={{ margin: "10px 0" }}
          onChange={handlePasswordChange}
          id="userPassword"
          label="Enter your password"
          variant="outlined"
          type={passVisible ? "text" : "password"}
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

        <Button sx={{ margin: "10px 0" }} onClick={login} variant="contained">
          Log In
        </Button>
      </div>
      <div className="create-account-container">
        <Link to="/signup">
          <Button
            sx={{ margin: "10px 0", backgroundColor: "green" }}
            variant="contained"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
