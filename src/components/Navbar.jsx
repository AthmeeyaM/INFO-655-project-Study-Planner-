import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={styles.sidebar}>
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
    backgroundColor: "#0078D4",
    padding: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px 0",
    fontSize: "18px",
  },
};

export default Navbar;
