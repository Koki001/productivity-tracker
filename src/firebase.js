// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHy2sS3h_kNjeKKASaWPle6-dVPiK40Gg",
  authDomain: "productivity-tracker-73a42.firebaseapp.com",
  projectId: "productivity-tracker-73a42",
  storageBucket: "productivity-tracker-73a42.appspot.com",
  messagingSenderId: "376540992179",
  appId: "1:376540992179:web:3bc4385609aa9e752696c6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
