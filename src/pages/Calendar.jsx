import { useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DarkModeContext } from "../context/DarkModeContext"; 

const CalendarPage = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? "#121212" : "#f9f9f9", color: darkMode ? "#ffffff" : "#000000" }}>
      <h2 style={styles.title}>Calendar</h2>
      <div style={{ ...styles.calendarContainer, backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p style={{ ...styles.selectedDate, color: darkMode ? "#ffffff" : "#000000" }}>Selected Date: {date.toDateString()}</p>
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
