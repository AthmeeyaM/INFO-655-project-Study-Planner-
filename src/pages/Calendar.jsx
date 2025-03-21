import { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DarkModeContext } from "../context/DarkModeContext";

const CalendarPage = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const allTasks = Object.values(savedTasks).flat();
    setTasks(allTasks);
  }, []);

  const tasksForDate = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? "#121212" : "#f9f9f9", color: darkMode ? "#ffffff" : "#000000" }}>
      <h2 style={styles.title}>Calendar</h2>
      <div style={{ ...styles.calendarContainer, backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p style={{ ...styles.selectedDate, color: darkMode ? "#ffffff" : "#000000" }}>
        Selected Date: {date.toDateString()}
      </p>
      {tasksForDate.length > 0 ? (
        <ul>
          {tasksForDate.map((task) => (
            <li key={task.id}>{task.title} {task.dueTime && `at ${task.dueTime}`}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks due on this date.</p>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px", borderRadius: "10px", width: "60%", margin: "auto" },
  title: { fontSize: "24px", marginBottom: "10px" },
  calendarContainer: { padding: "10px", borderRadius: "10px", display: "inline-block" },
  selectedDate: { fontSize: "16px", marginTop: "10px" },
};

export default CalendarPage;
