import { useState, useEffect } from "react";

const NotesSection = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editNoteId, setEditNoteId] = useState(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedMode !== null) {
      setDarkMode(savedMode);
    }
  }, []);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.title.trim() !== "" && newNote.description.trim() !== "") {
      const updatedNotes = [...notes, { id: Date.now(), ...newNote }];
      setNotes(updatedNotes);
      setNewNote({ title: "", description: "" });
      setShowInputFields(false);
    }
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const startEditNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);
    setNewNote({ title: noteToEdit.title, description: noteToEdit.description });
    setEditNoteId(id);
    setShowInputFields(true);
    setSelectedNote(null);
  };

  const updateNote = () => {
    if (newNote.title.trim() !== "" && newNote.description.trim() !== "") {
      const updatedNotes = notes.map((note) =>
        note.id === editNoteId ? { ...note, ...newNote } : note
      );
      setNotes(updatedNotes);
      setNewNote({ title: "", description: "" });
      setEditNoteId(null);
      setShowInputFields(false);
    }
  };

  const openDialog = (note) => {
    setSelectedNote(note);
  };

  const closeDialog = () => {
    setSelectedNote(null);
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#333",
      }}
    >
      <h1 style={styles.heading}>Notes and Resources</h1>

      {!showInputFields ? (
        <button onClick={() => setShowInputFields(true)} style={styles.addNoteButton}>
          Add Note
        </button>
      ) : (
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Enter note title"
            style={styles.input}
          />
          <textarea
            value={newNote.description}
            onChange={(e) =>
              setNewNote({ ...newNote, description: e.target.value })
            }
            placeholder="Enter note description"
            style={styles.textarea}
          />
          {editNoteId ? (
            <button onClick={updateNote} style={styles.addButton}>
              Update Note
            </button>
          ) : (
            <button onClick={addNote} style={styles.addButton}>
              Save Note
            </button>
          )}
        </div>
      )}

      <div style={styles.notesGrid}>
        {notes.map((note) => (
          <div key={note.id} style={{ 
            ...styles.note, 
            backgroundColor: darkMode ? "#333" : "#f9f9f9", 
            color: darkMode ? "#ffffff" : "#000" 
          }}>
            <h3 style={styles.noteTitle}>{note.title}</h3>
            <p style={styles.noteDescription}>
              {note.description.length > 100
                ? note.description.substring(0, 100) + "..."
                : note.description}
            </p>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => startEditNote(note.id)}
                style={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                style={styles.deleteButton}
              >
                Delete
              </button>
              <button
                onClick={() => openDialog(note)}
                style={styles.viewButton}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div style={styles.dialogOverlay}>
          <div style={{ 
            ...styles.dialog, 
            backgroundColor: darkMode ? "#222" : "#fff", 
            color: darkMode ? "#ffffff" : "#000" 
          }}>
            <h3 style={styles.dialogTitle}>{selectedNote.title}</h3>
            <div style={styles.dialogContent}>{selectedNote.description}</div>
            <div style={styles.dialogButtonContainer}>
              <button
                onClick={() => {
                  startEditNote(selectedNote.id);
                  closeDialog();
                }}
                style={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(selectedNote.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
              <button onClick={closeDialog} style={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  heading: {
    textAlign: "center",
    transition: "color 0.3s ease",
  },
  addNoteButton: {
    display: "block",
    margin: "20px auto",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0078D4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  note: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
};

export default NotesSection;
