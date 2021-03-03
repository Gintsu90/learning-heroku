import React, {useState, useEffect} from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notifaction from "./components/Notifaction";
import Footer from "./components/Footer";
import axios from "axios";

function App(props) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("effect");
    noteService
      .getAll()
      .then(initialNotes => {
        console.log(initialNotes)
        setNotes(initialNotes)
      })
  }, [])
  console.log("render", notes.length, "notes")

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    };
    
    noteService
      .create(noteObject)
      .then(returnedNote=> {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }
  
  const handleNoteChange = (event) => {
    console.log("#", event.target.value);
    setNewNote(event.target.value);
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggelImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notifaction message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note._id} toggleImportance={() => toggelImportanceOf(note.id)} note={note}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
    
  );
}

export default App;

