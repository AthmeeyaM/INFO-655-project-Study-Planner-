import { useState, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { NotificationContext } from "../context/NotificationContext";
import useTasks from "../hooks/useTasks";

const Dashboard = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { scheduleNotification } = useContext(NotificationContext);
  const { tasks, addTask, editTask, toggleTaskCompletion, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDueTime, setNewDueTime] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedDueTime, setEditedDueTime] = useState("");
  const [editedNotificationTime, setEditedNotificationTime] = useState("");

  const formatDateTime = (dueDate, dueTime) => {
    if (!dueDate) return "";
    const date = new Date(dueDate);
    const dateStr = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return dueTime ? `${dateStr} ${dueTime}` : dateStr;
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      alert("Please enter a task.");
      return;
    }
    const newTaskObj = addTask(newTask, newDueDate, newDueTime, notificationTime);
    scheduleNotification(newTaskObj);
    setNewTask("");
    setNewDueDate("");
    setNewDueTime("");
    setNotificationTime("");
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditedDueTime(task.dueTime || "");
    setEditedNotificationTime(task.notificationTime || "");
  };

  const handleSaveEdit = () => {
    const editedTaskObj = editTask(editTaskId, editedTask, editedDueDate, editedDueTime, editedNotificationTime);
    scheduleNotification(editedTaskObj);
    setEditTaskId(null);
    setEditedTask("");
    setEditedDueDate("");
    setEditedDueTime("");
    setEditedNotificationTime("");
  };

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? "#121212" : "#f9f9f9", color: darkMode ? "#ffffff" : "#000000" }}>
      <h2 style={styles.title}>Dashboard</h2>
      <div style={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ ...styles.input, backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          style={styles.dateInput}
        />
        <input
          type="time"
          value={newDueTime}
          onChange={(e) => setNewDueTime(e.target.value)}
          style={styles.dateInput}
        />
        <input
          type="number"
          placeholder="Notify (hours before)"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          min="0"
          step="0.1"
          style={styles.dateInput}
        />
        <button onClick={handleAddTask} style={styles.addButton}>Add Task</button>
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
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    style={styles.dateInput}
                  />
                  <input
                    type="time"
                    value={editedDueTime}
                    onChange={(e) => setEditedDueTime(e.target.value)}
                    style={styles.dateInput}
                  />
                  <input
                    type="number"
                    value={editedNotificationTime}
                    onChange={(e) => setEditedNotificationTime(e.target.value)}
                    min="0"
                    step="0.1"
                    placeholder="Notify (hours before)"
                    style={styles.dateInput}
                  />
                  <button onClick={handleSaveEdit} style={styles.saveButton}>Save</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <span style={styles.taskText}>
                    {task.title}
                    {task.dueDate && (
                      <span style={styles.dueDate}> (Due: {formatDateTime(task.dueDate, task.dueTime)})</span>
                    )}
                    {task.notificationTime && (
                      <span style={styles.dueDate}> (Notify: {task.notificationTime} hrs before)</span>
                    )}
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
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span>
                {task.title}
                {task.dueDate && (
                  <span style={styles.dueDate}> (Due: {formatDateTime(task.dueDate, task.dueTime)})</span>
                )}
                {task.notificationTime && (
                  <span style={styles.dueDate}> (Notify: {task.notificationTime} hrs before)</span>
                )}
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