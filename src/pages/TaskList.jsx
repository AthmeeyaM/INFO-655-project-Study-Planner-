import { useState, useEffect, useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const TaskList = () => {
  const { scheduleNotification } = useContext(NotificationContext);
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedDueTime, setEditedDueTime] = useState("");
  const [editedNotificationTime, setEditedNotificationTime] = useState("");
  const [newTasks, setNewTasks] = useState({});
  const [newDueDates, setNewDueDates] = useState({});
  const [newDueTimes, setNewDueTimes] = useState({});
  const [newNotificationTimes, setNewNotificationTimes] = useState({});

  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem("sections")) || ["General"];
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || { General: [] };
    setSections(savedSections);
    setTasks(savedTasks);

    const initialTaskState = savedSections.reduce((acc, sec) => ({ ...acc, [sec]: "" }), {});
    setNewTasks(initialTaskState);
    setNewDueDates(initialTaskState);
    setNewDueTimes(initialTaskState);
    setNewNotificationTimes(initialTaskState);

    Object.values(savedTasks).flat().forEach((task) => scheduleNotification(task));
  }, []);

  const saveDataToStorage = (updatedTasks, updatedSections) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("sections", JSON.stringify(updatedSections));
    setTasks(updatedTasks);
    setSections(updatedSections);
  };

  const addSection = () => {
    const sectionName = prompt("Enter new section name:");
    if (sectionName && !sections.includes(sectionName)) {
      const updatedSections = [sectionName, ...sections];
      saveDataToStorage({ ...tasks, [sectionName]: [] }, updatedSections);
      setNewTasks({ ...newTasks, [sectionName]: "" });
      setNewDueDates({ ...newDueDates, [sectionName]: "" });
      setNewDueTimes({ ...newDueTimes, [sectionName]: "" });
      setNewNotificationTimes({ ...newNotificationTimes, [sectionName]: "" });
    }
  };

  const renameSection = (oldName) => {
    setEditingSection(oldName);
    setNewSectionName(oldName);
  };

  const saveSectionRename = (oldName) => {
    const updatedSections = sections.map((sec) => (sec === oldName ? newSectionName : sec));
    const updatedTasks = { ...tasks, [newSectionName]: tasks[oldName] || [] };
    if (oldName !== newSectionName) delete updatedTasks[oldName];
    saveDataToStorage(updatedTasks, updatedSections);
    setEditingSection(null);
  };

  const deleteSection = (sectionName) => {
    if (sectionName === "General") {
      alert("Cannot delete the default 'General' section.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${sectionName}"?`)) {
      const updatedSections = sections.filter((sec) => sec !== sectionName);
      const updatedTasks = { ...tasks };
      delete updatedTasks[sectionName];
      saveDataToStorage(updatedTasks, updatedSections);
    }
  };

  const addTask = (section) => {
    if (!newTasks[section].trim()) return;
    const dueDateTime = newDueDates[section] && newDueTimes[section]
      ? new Date(`${newDueDates[section]}T${newDueTimes[section]}:00`).toISOString()
      : newDueDates[section]
      ? new Date(`${newDueDates[section]}T00:00:00`).toISOString()
      : null;

    const newTaskObj = {
      id: Date.now().toString(),
      title: newTasks[section],
      dueDate: dueDateTime,
      dueTime: newDueTimes[section] || null,
      notificationTime: newNotificationTimes[section] ? parseInt(newNotificationTimes[section]) : null,
      completed: false,
      section,
    };
    const updatedTasks = { ...tasks, [section]: [...(tasks[section] || []), newTaskObj] };
    saveDataToStorage(updatedTasks, sections);
    scheduleNotification(newTaskObj);
    setNewTasks({ ...newTasks, [section]: "" });
    setNewDueDates({ ...newDueDates, [section]: "" });
    setNewDueTimes({ ...newDueTimes, [section]: "" });
    setNewNotificationTimes({ ...newNotificationTimes, [section]: "" });
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditedDueTime(task.dueTime || "");
    setEditedNotificationTime(task.notificationTime || "");
  };

  const saveEdit = (section) => {
    const dueDateTime = editedDueDate && editedDueTime
      ? new Date(`${editedDueDate}T${editedDueTime}:00`).toISOString()
      : editedDueDate
      ? new Date(`${editedDueDate}T00:00:00`).toISOString()
      : null;

    const updatedSectionTasks = tasks[section].map((task) =>
      task.id === editingTaskId
        ? {
            ...task,
            title: editedTask,
            dueDate: dueDateTime,
            dueTime: editedDueTime || null,
            notificationTime: editedNotificationTime ? parseInt(editedNotificationTime) : null,
          }
        : task
    );
    const updatedTasks = { ...tasks, [section]: updatedSectionTasks };
    saveDataToStorage(updatedTasks, sections);
    const editedTaskObj = updatedSectionTasks.find((t) => t.id === editingTaskId);
    scheduleNotification(editedTaskObj);
    setEditingTaskId(null);
  };

  const deleteTask = (section, taskId) => {
    const updatedSectionTasks = tasks[section].filter((task) => task.id !== taskId);
    const updatedTasks = { ...tasks, [section]: updatedSectionTasks };
    saveDataToStorage(updatedTasks, sections);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  return (
    <div style={{ textAlign: "center", margin: "20px auto", padding: "20px", width: "60%" }}>
      <h2>Task Manager</h2>
      <div>
        <button
          onClick={addSection}
          style={{ padding: "8px", backgroundColor: "#0078D4", color: "white", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}
        >
          + New Section
        </button>
      </div>

      {sections.map((section) => (
        <div key={section} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h3>
            {editingSection === section ? (
              <>
                <input type="text" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
                <button onClick={() => saveSectionRename(section)}>✔</button>
              </>
            ) : (
              <>
                {section}
                <button onClick={() => renameSection(section)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                  ✏
                </button>
                <button
                  onClick={() => deleteSection(section)}
                  style={{ marginLeft: "10px", cursor: "pointer", backgroundColor: "red", color: "white", borderRadius: "5px", padding: "5px 10px" }}
                >
                  🗑
                </button>
              </>
            )}
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Task name"
              value={newTasks[section]}
              onChange={(e) => setNewTasks({ ...newTasks, [section]: e.target.value })}
            />
            <input
              type="date"
              value={newDueDates[section]}
              onChange={(e) => setNewDueDates({ ...newDueDates, [section]: e.target.value })}
            />
            <input
              type="time"
              value={newDueTimes[section]}
              onChange={(e) => setNewDueTimes({ ...newDueTimes, [section]: e.target.value })}
            />
            <input
              type="number"
              placeholder="Notify (hours before)"
              value={newNotificationTimes[section]}
              onChange={(e) => setNewNotificationTimes({ ...newNotificationTimes, [section]: e.target.value })}
              min="0"
              step="0.1" // Allow decimals for more flexibility
            />
            <button
              onClick={() => addTask(section)}
              style={{ padding: "5px", backgroundColor: "#28a745", color: "white", borderRadius: "5px", cursor: "pointer" }}
            >
              +
            </button>
          </div>

          <ul>
            {sortTasks(tasks[section] || []).map((task) => (
              <li key={task.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px", borderBottom: "1px solid #ddd" }}>
                {editingTaskId === task.id ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="text" value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
                    <input type="date" value={editedDueDate} onChange={(e) => setEditedDueDate(e.target.value)} />
                    <input type="time" value={editedDueTime} onChange={(e) => setEditedDueTime(e.target.value)} />
                    <input
                      type="number"
                      value={editedNotificationTime}
                      onChange={(e) => setEditedNotificationTime(e.target.value)}
                      min="0"
                      step="0.1"
                      placeholder="Notify (hours before)"
                    />
                    <button
                      onClick={() => saveEdit(section)}
                      style={{ padding: "5px", backgroundColor: "#0078D4", color: "white", borderRadius: "5px" }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    {task.title}{" "}
                    {task.dueDate && ` (Due: ${formatDate(task.dueDate)}${task.dueTime ? ` ${task.dueTime}` : ""})`}
                    {task.notificationTime && ` (Notify: ${task.notificationTime} hrs before)`}
                    <button
                      onClick={() => handleEdit(task)}
                      style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", padding: "5px", cursor: "pointer" }}
                    >
                      ✏
                    </button>
                    <button
                      onClick={() => deleteTask(section, task.id)}
                      style={{ backgroundColor: "red", color: "white", borderRadius: "5px", padding: "5px", cursor: "pointer" }}
                    >
                      🗑
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;