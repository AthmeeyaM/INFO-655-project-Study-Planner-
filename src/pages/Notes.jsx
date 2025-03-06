import { useState, useEffect } from "react";

const NotesSection = () => {
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
    <div style={styles.container}>
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
          <div key={note.id} style={styles.note}>
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
          <div style={styles.dialog}>
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
  },
  heading: {
    textAlign: "center",
    color: "#333",
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
  inputContainer: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
    minHeight: "100px",
    resize: "vertical",
  },
  addButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
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
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  noteTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noteDescription: {
    margin: "0",
    fontSize: "14px",
    color: "#555",
    minHeight: "100px",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  editButton: {
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  deleteButton: {
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  viewButton: {
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#0078D4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  dialogOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
  },
  dialogTitle: {
    margin: "0 0 10px 0",
    fontSize: "20px",
    fontWeight: "bold",
  },
  dialogDescription: {
    margin: "0",
    fontSize: "16px",
    color: "#555",
  },
  dialogButtonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  closeButton: {
    padding: "5px 10px",
    fontSize: "14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    flex: 1,
  },
  dialogContent: {
    maxHeight: "300px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
};

export default NotesSection;