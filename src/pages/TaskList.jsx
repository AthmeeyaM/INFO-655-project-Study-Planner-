import { useState, useEffect, useContext } from "react"; 
import { NotificationContext } from "../context/NotificationContext";
import useTasks from "../hooks/useTasks";

const TaskList = () => {
  const { scheduleNotification } = useContext(NotificationContext) || {};
  const { tasks, sections, addTask, editTask, deleteTask, addSection, renameSection, deleteSection } = useTasks();
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
    if (sections.length === 0) return; 
    const initialState = sections.reduce((acc, sec) => ({ ...acc, [sec]: "" }), {});
    setNewTasks(initialState);
    setNewDueDates(initialState);
    setNewDueTimes(initialState);
    setNewNotificationTimes(initialState);
  }, [sections]);

  const handleAddSection = () => {
    const sectionName = prompt("Enter new section name:");
    if (sectionName) addSection(sectionName);
  };

  const handleRenameSection = (oldName) => {
    setEditingSection(oldName);
    setNewSectionName(oldName);
  };

  const handleSaveSectionRename = (oldName) => {
    renameSection(oldName, newSectionName);
    setEditingSection(null);
  };

  const handleDeleteSection = (sectionName) => {
    if (sectionName === "General") {
      alert("Cannot delete the default 'General' section.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${sectionName}"?`)) {
      deleteSection(sectionName);
    }
  };

  const handleAddTask = (section) => {
    if (!newTasks[section]?.trim()) return;
    const newTaskObj = addTask(newTasks[section], newDueDates[section], newDueTimes[section], newNotificationTimes[section], section);
    if (scheduleNotification) scheduleNotification(newTaskObj);
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

  const handleSaveEdit = () => {
    const editedTaskObj = editTask(editingTaskId, editedTask, editedDueDate, editedDueTime, editedNotificationTime);
    if (scheduleNotification) scheduleNotification(editedTaskObj);
    setEditingTaskId(null);
    setEditedTask("");
    setEditedDueDate("");
    setEditedDueTime("");
    setEditedNotificationTime("");
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

  const getSectionTasks = (section) => tasks.filter((task) => task.section === section);
  if (!sections || sections.length === 0) {
    return <div>Loading sections...</div>;
  }

  return (
    <div style={{ textAlign: "center", margin: "20px auto", padding: "20px", width: "60%", minHeight: "400px" }}>
      <h2>Task Manager</h2>
      <div>
        <button
          onClick={handleAddSection}
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
                <button onClick={() => handleSaveSectionRename(section)} style={{ marginLeft: "5px" }}>✔</button>
              </>
            ) : (
              <>
                {section}
                <button onClick={() => handleRenameSection(section)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                  ✏
                </button>
                <button
                  onClick={() => handleDeleteSection(section)}
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
              value={newTasks[section] || ""}
              onChange={(e) => setNewTasks((prev) => ({ ...prev, [section]: e.target.value }))}
              style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="date"
              value={newDueDates[section] || ""}
              onChange={(e) => setNewDueDates((prev) => ({ ...prev, [section]: e.target.value }))}
              style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="time"
              value={newDueTimes[section] || ""}
              onChange={(e) => setNewDueTimes((prev) => ({ ...prev, [section]: e.target.value }))}
              style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              placeholder="Notify (hours before)"
              value={newNotificationTimes[section] || ""}
              onChange={(e) => setNewNotificationTimes((prev) => ({ ...prev, [section]: e.target.value }))}
              min="0"
              step="0.1"
              style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button
              onClick={() => handleAddTask(section)}
              style={{ padding: "5px", backgroundColor: "#28a745", color: "white", borderRadius: "5px", cursor: "pointer" }}
            >
              +
            </button>
          </div>

          <ul style={{ listStyle: "none", padding: "0" }}>
            {sortTasks(getSectionTasks(section)).length > 0 ? (
              sortTasks(getSectionTasks(section)).map((task) => (
                <li key={task.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px", borderBottom: "1px solid #ddd" }}>
                  {editingTaskId === task.id ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                      />
                      <input
                        type="date"
                        value={editedDueDate}
                        onChange={(e) => setEditedDueDate(e.target.value)}
                        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                      />
                      <input
                        type="time"
                        value={editedDueTime}
                        onChange={(e) => setEditedDueTime(e.target.value)}
                        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                      />
                      <input
                        type="number"
                        value={editedNotificationTime}
                        onChange={(e) => setEditedNotificationTime(e.target.value)}
                        min="0"
                        step="0.1"
                        placeholder="Notify (hours before)"
                        style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                      />
                      <button
                        onClick={handleSaveEdit}
                        style={{ padding: "5px", backgroundColor: "#0078D4", color: "white", borderRadius: "5px" }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>
                        {task.title}{" "}
                        {task.dueDate && ` (Due: ${formatDate(task.dueDate)}${task.dueTime ? ` ${task.dueTime}` : ""})`}
                        {task.notificationTime && ` (Notify: ${task.notificationTime} hrs before)`}
                      </span>
                      <div>
                        <button
                          onClick={() => handleEdit(task)}
                          style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", padding: "5px", cursor: "pointer", marginRight: "5px" }}
                        >
                          ✏
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{ backgroundColor: "red", color: "white", borderRadius: "5px", padding: "5px", cursor: "pointer" }}
                        >
                          🗑
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li>No tasks in this section.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;