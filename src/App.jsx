import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/Calendar";
import TaskList from "./pages/TaskList";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import { DarkModeContext } from "./context/DarkModeContext";
import { NotificationContext } from "./context/NotificationContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { notificationsEnabled, toggleNotifications } = useContext(NotificationContext); 

  return (
    <div
      style={{
        ...styles.appContainer,
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      <Navbar />
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/notes" element={<Notes />} />
          <Route
            path="/settings"
            element={<Settings notificationsEnabled={notificationsEnabled} toggleNotifications={toggleNotifications} />}
          />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
};

export default App;