import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Calendar</h2>
      <Calendar onChange={setDate} value={date} style={styles.calendar} />
      <p style={styles.selectedDate}>Selected Date: {date.toDateString()}</p>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", width: "60%", margin: "auto" },
  title: { fontSize: "24px", marginBottom: "10px" },
  calendar: { width: "100%", maxWidth: "500px", margin: "auto" },
  selectedDate: { fontSize: "16px", marginTop: "10px" },
};

export default CalendarPage;
