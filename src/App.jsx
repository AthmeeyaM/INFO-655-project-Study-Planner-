import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/Calendar";
import TaskList from "./pages/TaskList";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";

function App() {
  return (
    <div style={styles.appContainer}>
      <Navbar />
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
};

export default App;
