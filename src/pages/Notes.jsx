import { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

const NotesSection = () => {
  const { darkMode } = useContext(DarkModeContext); 
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editNoteId, setEditNoteId] = useState(null);
  const [showInputFields, setShowInputFields] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.title.trim() && newNote.description.trim()) {
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
    if (newNote.title.trim() && newNote.description.trim()) {
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
        <div
          style={{
            ...styles.inputBox,
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#ffffff" : "#000",
          }}
        >
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Enter note title"
            style={{
              ...styles.input,
              backgroundColor: darkMode ? "#444" : "#fff",
              color: darkMode ? "#ffffff" : "#000",
            }}
          />
          <textarea
            value={newNote.description}
            onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
            placeholder="Enter note description"
            style={{
              ...styles.textarea,
              backgroundColor: darkMode ? "#444" : "#fff",
              color: darkMode ? "#ffffff" : "#000",
            }}
          />
          <button
            onClick={editNoteId ? updateNote : addNote}
            style={styles.addButton}
          >
            {editNoteId ? "Update Note" : "Save Note"}
          </button>
        </div>
      )}

      <div style={styles.notesGrid}>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              ...styles.note,
              backgroundColor: darkMode ? "#333" : "#f9f9f9",
              color: darkMode ? "#ffffff" : "#000",
            }}
          >
            <h3 style={styles.noteTitle}>{note.title}</h3>
            <p style={styles.noteDescription}>
              {note.description.length > 100
                ? note.description.substring(0, 100) + "..."
                : note.description}
            </p>
            <div style={styles.buttonContainer}>
              <button onClick={() => startEditNote(note.id)} style={styles.editButton}>
                Edit
              </button>
              <button onClick={() => deleteNote(note.id)} style={styles.deleteButton}>
                Delete
              </button>
              <button onClick={() => openDialog(note)} style={styles.viewButton}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedNote && (
        <div style={styles.dialogOverlay}>
          <div
            style={{
              ...styles.dialog,
              backgroundColor: darkMode ? "#222" : "#fff",
              color: darkMode ? "#ffffff" : "#000",
            }}
          >
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
              <button onClick={() => deleteNote(selectedNote.id)} style={styles.deleteButton}>
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
    marginBottom: "20px",
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
  inputBox: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "600px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    boxSizing: "border-box",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    height: "150px",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    alignSelf: "flex-end",
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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "200px",
    overflow: "hidden",
  },
  noteTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noteDescription: {
    margin: "0",
    fontSize: "14px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    flex: 1,
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  dialogOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    borderRadius: "4px",
    padding: "20px",
    width: "500px",
    maxWidth: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  dialogTitle: {
    margin: "0 0 15px 0",
    fontSize: "20px",
    fontWeight: "bold",
  },
  dialogContent: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  dialogButtonContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  editButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#0078D4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  viewButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeButton: {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default NotesSection;