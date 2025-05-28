// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from './pages/Dashboard';
import TaskPage from './pages/TaskPage';

function App() {
  const [userEmail, setUserEmail] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUserEmail={setUserEmail} />} />
        <Route path="/dashboard" element={<Dashboard userEmail={userEmail} setUserEmail={setUserEmail} />} />
        <Route path="/tasks/:taskListId" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}


export default App;
