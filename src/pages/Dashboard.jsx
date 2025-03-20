import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const Dashboard = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const allTasks = Object.values(savedTasks).flat();
    allTasks.sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
    });
    setTasks(allTasks);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
  
    const year = date.getUTCFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${month}/${day}/${year}`;
  };
  
  const addTask = () => {
    if (!newTask.trim()) {
      alert("Please enter a task.");
      return;
    }
    const dueDateUtc = dueDate ? new Date(dueDate).toISOString() : null;

    const newTaskObj = {
      id: Date.now(),
      title: newTask,
      dueDate: dueDateUtc,
      completed: false,
      section: "General",
    };

    const updatedTasks = [...tasks, newTaskObj];
    updateTasksInStorage(updatedTasks);
    setNewTask("");
    setDueDate("");
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate || "");
  };

  const saveEdit = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, title: editedTask, dueDate: editedDueDate || task.dueDate } : task
    );
    updateTasksInStorage(updatedTasks);
    setEditTaskId(null);
  };

  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateTasksInStorage(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    updateTasksInStorage(updatedTasks);
  };

  const updateTasksInStorage = (updatedTasks) => {
    setTasks(updatedTasks);
    const sectionedTasks = updatedTasks.reduce((acc, task) => {
      if (!acc[task.section]) acc[task.section] = [];
      acc[task.section].push(task);
      return acc;
    }, {});
    localStorage.setItem("tasks", JSON.stringify(sectionedTasks));
  };

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? "#121212" : "#f9f9f9", color: darkMode ? "#ffffff" : "#000000" }}>
      <h2 style={styles.title}>Dashboard - Task Overview</h2>
      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ ...styles.input, backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.dateInput}
        />
        <button onClick={addTask} style={styles.addButton}>Add Task</button>
      </div>

      <h3 style={styles.sectionTitle}>Pending Tasks</h3>
      {tasks.filter((task) => !task.completed).length > 0 ? (
        <ul style={styles.taskList}>
          {tasks.filter((task) => !task.completed).map((task) => (
            <li key={task.id} style={{ ...styles.taskItem, backgroundColor: darkMode ? "#333" : "#fff" }}>
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    style={{ ...styles.input, backgroundColor: darkMode ? "#444" : "#fff", color: darkMode ? "#fff" : "#000" }}
                  />
                  <input
                    type="datetime-local"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    style={styles.dateInput}
                  />
                  <button onClick={saveEdit} style={styles.saveButton}>Save</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleCompletion(task.id)}
                  />
                  <span style={styles.taskText}>
                    {task.title}
                    {task.dueDate && <span style={styles.dueDate}> (Due: {formatDate(task.dueDate)})</span>}
                  </span>
                  <button onClick={() => handleEdit(task)} style={styles.editButton}>✏</button>
                  <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>🗑</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending tasks.</p>
      )}

      <h3 style={styles.sectionTitle}>Completed Tasks</h3>
      {tasks.filter((task) => task.completed).length > 0 ? (
        <ul style={styles.taskList}>
          {tasks.filter((task) => task.completed).map((task) => (
            <li key={task.id} style={{ ...styles.completedTask, backgroundColor: darkMode ? "#444" : "#e6f7e6" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              />
              <span>
                {task.title}
                {task.dueDate && <span style={styles.dueDate}> (Due: {formatDate(task.dueDate)})</span>}
              </span>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>🗑</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No completed tasks.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "20px auto",
    padding: "20px",
    borderRadius: "10px",
    width: "60%",
  },
  title: { fontSize: "24px", marginBottom: "10px" },
  inputSection: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    width: "40%",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  dateInput: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#0078D4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  sectionTitle: { fontSize: "20px", marginTop: "20px", color: "#0078D4" },
  taskList: { listStyleType: "none", padding: "0" },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  completedTask: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  taskText: { flex: "1", textAlign: "left" },
  dueDate: { fontSize: "12px", color: "#ff3d00", marginLeft: "5px" },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#0078D4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Dashboard;
