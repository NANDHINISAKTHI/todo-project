import React from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const LoginPage = ({ setUserEmail }) => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      setUserEmail(email);

      let res = await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 202) {
        const nickname = prompt("Welcome! Please enter your nickname:");
        if (!nickname || nickname.trim() === "") return alert("Nickname is required.");
        res = await fetch("http://localhost:5000/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nickname }),
        });
      }

      const data = await res.json();
      localStorage.setItem("nickname", data.user.nickname);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login Failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md text-center animate-fade-in transition-all">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 drop-shadow">Welcome Back! 👋</h1>
        <p className="text-gray-600 mb-8">Login to access your task dashboard</p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google icon"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
