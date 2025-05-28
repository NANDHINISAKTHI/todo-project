import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskPage = () => {
  const { taskListId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5000/api/tasks?taskListId=${taskListId}`);
    const data = await res.json();
    setTasks(data);
  };

  const handleAdd = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskListId, ...form }),
    });
    if (res.ok) {
      setForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
    }
  };

  const toggleStatus = async (task) => {
    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: task.status === "Open" ? "Complete" : "Open" }),
    });
    fetchTasks();
  };

  const handleEdit = async (task) => {
    const newTitle = prompt("Update title:", task.title);
    if (!newTitle) return;
    const newDescription = prompt("Update description:", task.description || "");
    const newDueDate = prompt("Update due date (YYYY-MM-DD):", task.dueDate?.slice(0, 10) || "");

    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
      }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [taskListId]);

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-bl from-yellow-100 via-pink-100 to-indigo-100">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-indigo-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tasks</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          className="border border-gray-300 p-2 rounded shadow-sm"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border border-gray-300 p-2 rounded shadow-sm"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          className="border border-gray-300 p-2 rounded shadow-sm"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
          onClick={handleAdd}
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-5 bg-white rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2
                className={`text-lg font-semibold ${
                  task.status === "Complete" ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.title}
              </h2>
              <p className="text-sm text-gray-600">{task.description}</p>
              {task.dueDate && (
                <p className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                  task.status === "Complete"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => toggleStatus(task)}
              >
                {task.status === "Open" ? "Complete" : "Reopen"}
              </button>
              <button
                className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => handleEdit(task)}
              >
                Edit
              </button>
              <button
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
