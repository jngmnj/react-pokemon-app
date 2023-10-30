// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDixTJ8130VA7CJtWe4rN3J9YGvdsv_R3A",
  authDomain: "react-pokemon-app-c8a1d.firebaseapp.com",
  projectId: "react-pokemon-app-c8a1d",
  storageBucket: "react-pokemon-app-c8a1d.appspot.com",
  messagingSenderId: "382798565552",
  appId: "1:382798565552:web:20644a7c65c313223b6b75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;