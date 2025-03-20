import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext"; 

const Navbar = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div style={{
      ...styles.sidebar,
      backgroundColor: darkMode ? "#1E1E1E" : "#0078D4",
      color: darkMode ? "#ffffff" : "white",
      border: `2px solid ${darkMode ? "#444" : "#005a9e"}`,
      boxShadow: darkMode ? "0 4px 8px rgba(0, 0, 0, 0.5)" : "0 4px 8px rgba(0, 120, 212, 0.3)"
    }}>
      <h2 style={styles.title}>Study Planner</h2>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/tasks" style={styles.link}>Tasks</Link>
      <Link to="/calendar" style={styles.link}>Calendar</Link>
      <Link to="/notes" style={styles.link}>Notes</Link>
      <Link to="/settings" style={styles.link}>Settings</Link>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px", 
    transition: "all 0.3s ease-in-out"
  },
  title: { fontSize: "22px", fontWeight: "bold", marginBottom: "20px" },
  link: { 
    textDecoration: "none",
    padding: "10px 0",
    fontSize: "18px",
    color: "inherit",
    transition: "color 0.3s ease"
  },
};

export default Navbar;
