import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const Settings = ({ notificationsEnabled, toggleNotifications }) => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5" }}>
      <h2 style={{ ...styles.title, color: darkMode ? "#fff" : "#333" }}>Settings</h2>

      <div style={styles.toggleSection}>
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} style={styles.button}>
          {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
        </button>
      </div>

      <div style={styles.toggleSection}>
        {/* Notifications Toggle */}
        <button onClick={toggleNotifications} style={styles.button}>
          {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "30px auto",
    padding: "30px",
    borderRadius: "15px",
    width: "70%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    transition: "color 0.3s ease",
  },
  toggleSection: {
    marginBottom: "20px",
  },
  button: {
    padding: "12px 24px",
    margin: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "inline-block",
    width: "100%",
    maxWidth: "280px",
    fontSize: "16px",
    transition: "background-color 0.3s ease, transform 0.3s ease",
  },
};

export default Settings;
