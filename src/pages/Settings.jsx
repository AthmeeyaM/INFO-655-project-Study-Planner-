import { useState, useEffect } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedMode) {
      setDarkMode(savedMode);
      document.body.style.backgroundColor = savedMode ? "#333" : "#fff";
      document.body.style.color = savedMode ? "#fff" : "#000";
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    document.body.style.backgroundColor = newMode ? "#333" : "#fff";
    document.body.style.color = newMode ? "#fff" : "#000";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Settings</h2>
      <button onClick={toggleDarkMode} style={styles.button}>
        {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    width: "60%",
  },
  title: {
    fontSize: "24px",
    color: "#333",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Settings;
