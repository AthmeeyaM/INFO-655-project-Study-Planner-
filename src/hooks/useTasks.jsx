import { useState, useEffect } from "react";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || { General: [] };
    const savedSections = JSON.parse(localStorage.getItem("sections")) || ["General"];
    const allTasks = Object.values(savedTasks).flat().sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
    });
    setTasks(allTasks);
    setSections(savedSections);
  }, []);

  const saveTasks = (updatedTasks, updatedSections = sections) => {
    const sectionedTasks = updatedTasks.reduce((acc, task) => {
      acc[task.section] = acc[task.section] || [];
      acc[task.section].push(task);
      return acc;
    }, {});
    localStorage.setItem("tasks", JSON.stringify(sectionedTasks));
    localStorage.setItem("sections", JSON.stringify(updatedSections));
    setTasks(updatedTasks);
    setSections(updatedSections);
  };

  const addTask = (title, dueDate, dueTime, notificationTime, section = "General") => {
    const dueDateTime = dueDate && dueTime
      ? new Date(`${dueDate}T${dueTime}:00`).toISOString()
      : dueDate
      ? new Date(`${dueDate}T00:00:00`).toISOString()
      : null;

    const newTask = {
      id: Date.now().toString(),
      title,
      dueDate: dueDateTime,
      dueTime: dueTime || null,
      notificationTime: notificationTime ? parseInt(notificationTime) : null,
      completed: false,
      section,
    };
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  };

  const editTask = (taskId, title, dueDate, dueTime, notificationTime) => {
    const dueDateTime = dueDate && dueTime
      ? new Date(`${dueDate}T${dueTime}:00`).toISOString()
      : dueDate
      ? new Date(`${dueDate}T00:00:00`).toISOString()
      : null;

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, title, dueDate: dueDateTime, dueTime: dueTime || null, notificationTime: notificationTime ? parseInt(notificationTime) : task.notificationTime }
        : task
    );
    saveTasks(updatedTasks);
    return updatedTasks.find((t) => t.id === taskId); 
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const addSection = (sectionName) => {
    if (!sectionName || sections.includes(sectionName)) return;
    const updatedSections = [sectionName, ...sections];
    saveTasks(tasks, updatedSections);
  };

  const renameSection = (oldName, newName) => {
    if (oldName === newName || !newName || sections.includes(newName)) return;
    const updatedSections = sections.map((sec) => (sec === oldName ? newName : sec));
    const updatedTasks = tasks.map((task) =>
      task.section === oldName ? { ...task, section: newName } : task
    );
    saveTasks(updatedTasks, updatedSections);
  };

  const deleteSection = (sectionName) => {
    if (sectionName === "General") return;
    const updatedSections = sections.filter((sec) => sec !== sectionName);
    const updatedTasks = tasks.filter((task) => task.section !== sectionName);
    saveTasks(updatedTasks, updatedSections);
  };

  return {
    tasks,
    sections,
    addTask,
    editTask,
    toggleTaskCompletion,
    deleteTask,
    addSection,
    renameSection,
    deleteSection,
  };
};

export default useTasks;