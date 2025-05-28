import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = ({ userEmail, setUserEmail }) => {
  const [taskLists, setTaskLists] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname");

  const fetchTaskLists = async () => {
    const res = await fetch(`http://localhost:5000/api/tasklists?email=${userEmail}`);
    const data = await res.json();
    setTaskLists(data);
  };

  const handleCreateList = async () => {
    if (!title) return alert("Title required");
    await fetch("http://localhost:5000/api/tasklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, title }),
    });
    setTitle("");
    fetchTaskLists();
  };

  const handleDeleteList = async (id) => {
    const confirm = window.confirm("Delete this task list and all its tasks?");
    if (!confirm) return;
    await fetch(`http://localhost:5000/api/tasklists/${id}`, { method: "DELETE" });
    fetchTaskLists();
  };

  const handleRenameList = async (id, oldTitle) => {
    const newTitle = prompt("Enter new title:", oldTitle);
    if (!newTitle.trim()) return;
    await fetch(`http://localhost:5000/api/tasklists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    fetchTaskLists();
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserEmail("");
    localStorage.removeItem("nickname");
    navigate("/");
  };

  useEffect(() => {
    if (userEmail) fetchTaskLists();
  }, [userEmail]);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome, <span className="text-indigo-600">{nickname || userEmail}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex mb-6 gap-2">
        <input
          className="flex-1 border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter new task list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleCreateList}
          className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700"
        >
          Create
        </button>
      </div>

      {taskLists.length === 0 ? (
        <p className="text-center text-gray-600">No task lists created yet. Start by adding one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {taskLists.map((list) => (
            <div
              key={list._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition-all relative"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/tasks/${list._id}`)}
              >
                <h2 className="text-xl font-semibold text-gray-800">{list.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleRenameList(list._id, list.title)}
                  className="text-xs px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
