import { useState, useEffect } from "react";

const TaskList = () => {
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [newTasks, setNewTasks] = useState({});
  const [newDueDates, setNewDueDates] = useState({});

  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem("sections")) || ["General"];
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || { General: [] };
    setSections(savedSections);
    setTasks(savedTasks);

    const initialTaskState = savedSections.reduce((acc, sec) => ({ ...acc, [sec]: "" }), {});
    const initialDateState = savedSections.reduce((acc, sec) => ({ ...acc, [sec]: "" }), {});
    setNewTasks(initialTaskState);
    setNewDueDates(initialDateState);
  }, []);

  const saveDataToStorage = (updatedTasks, updatedSections) => {
    setTasks(updatedTasks);
    setSections(updatedSections);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("sections", JSON.stringify(updatedSections));
  };

  const addSection = () => {
    const sectionName = prompt("Enter new section name:");
    if (sectionName && !sections.includes(sectionName)) {
      const updatedSections = [sectionName, ...sections]; 
      saveDataToStorage({ ...tasks, [sectionName]: [] }, updatedSections);
      setNewTasks({ ...newTasks, [sectionName]: "" });
      setNewDueDates({ ...newDueDates, [sectionName]: "" });
    }
  };

  const renameSection = (oldName) => {
    setEditingSection(oldName);
    setNewSectionName(oldName);
  };

  const saveSectionRename = (oldName) => {
    const updatedSections = sections.map((sec) => (sec === oldName ? newSectionName : sec));
    const updatedTasks = { ...tasks, [newSectionName]: tasks[oldName] || [] };

    if (oldName !== newSectionName) {
      delete updatedTasks[oldName];
    }

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
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTasks[section],
      dueDate: newDueDates[section] ? newDueDates[section] : null, 
      completed: false,
    };
    saveDataToStorage({ ...tasks, [section]: [...(tasks[section] || []), newTaskObj] }, sections);
    setNewTasks({ ...newTasks, [section]: "" });
    setNewDueDates({ ...newDueDates, [section]: "" });
  };
  
  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? formatDateForInput(task.dueDate) : "");
  };

  const saveEdit = (section) => {
    const updatedTasks = tasks[section].map((task) =>
      task.id === editingTaskId ? { ...task, title: editedTask, dueDate: editedDueDate ? formatDate(editedDueDate) : null } : task
    );
    saveDataToStorage({ ...tasks, [section]: updatedTasks }, sections);
    setEditingTaskId(null);
  };

  const deleteTask = (section, taskId) => {
    saveDataToStorage({ ...tasks, [section]: tasks[section].filter((task) => task.id !== taskId) }, sections);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; 
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts; 
      return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`; 
    }
    return dateString; 
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""; 
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [month, day, year] = parts; 
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`; 
    }
    return dateString; 
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
        <button onClick={addSection} style={{ padding: "8px", backgroundColor: "#0078D4", color: "white", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>+ New Section</button>
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
                <button onClick={() => renameSection(section)} style={{ marginLeft: "10px", cursor: "pointer" }}>✏</button>
                <button onClick={() => deleteSection(section)} style={{ marginLeft: "10px", cursor: "pointer", backgroundColor: "red", color: "white", borderRadius: "5px", padding: "5px 10px" }}>🗑</button>
              </>
            )}
          </h3>

          {/* Add Task Input in Each Section */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <input type="text" placeholder="Task name" value={newTasks[section]} onChange={(e) => setNewTasks({ ...newTasks, [section]: e.target.value })} />
            <input type="date" value={newDueDates[section]} onChange={(e) => setNewDueDates({ ...newDueDates, [section]: e.target.value })} />
            <button onClick={() => addTask(section)} style={{ padding: "5px", backgroundColor: "#28a745", color: "white", borderRadius: "5px", cursor: "pointer" }}>+</button>
          </div>

          <ul>
            {sortTasks(tasks[section] || []).map((task) => (
              <li key={task.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px", borderBottom: "1px solid #ddd" }}>
                {task.title} {task.dueDate && ` (Due: ${formatDate(task.dueDate)})`}
                <button onClick={() => handleEdit(task)}>✏</button>
                <button onClick={() => deleteTask(section, task.id)}>🗑</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
