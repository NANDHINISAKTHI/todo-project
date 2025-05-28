


// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAI_v_g8mNukgItIQlJeK6kqekG1rQGbAg",
    authDomain: "todoapp-592c2.firebaseapp.com",
    projectId: "todoapp-592c2",
    storageBucket: "todoapp-592c2.firebasestorage.app",
    messagingSenderId: "756721264489",
    appId: "1:756721264489:web:5afc37f426090074d6fff8"
  };

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account", // <- this forces the account list to appear
});

export { auth, provider };
