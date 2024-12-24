import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCPhTf35H-6QRXqUYZLLdL6QnXFtPou6qU",
  authDomain: "practice-2024-2cf9d.firebaseapp.com",
  databaseURL: "https://practice-2024-2cf9d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "practice-2024-2cf9d",
  storageBucket: "practice-2024-2cf9d.firebasestorage.app",
  messagingSenderId: "781001774275",
  appId: "1:781001774275:web:af81307e67927cd3027e76",
  measurementId: "G-XFZB4YQT0M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()

const email = sessionStorage.getItem("email");
const password = sessionStorage.getItem("password");

signInWithEmailAndPassword(auth, email, password)
.then(function() {
  console.log("User logged in")
})
.catch(function(error) {
  const errorMessage = error.message;
  console.error("Login error:", errorMessage);
})