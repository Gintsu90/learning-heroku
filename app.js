const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config()
const Note = require('./models/notes');
const { response } = require("express");


app.use(express.json());
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())

// let notes = [
//     {
//       id: 1,
//       content: "HTML is easy",
//       date: "2019-05-30T17:30:31.098Z",
//       important: true
//     },
//     {
//       id: 2,
//       content: "Browser can execute only Javascript",
//       date: "2019-05-30T18:39:34.091Z",
//       important: false
//     },
//     {
//       id: 3,
//       content: "GET and POST are the most important methods of HTTP protocol",
//       date: "2019-05-30T19:20:14.298Z",
//       important: true
//     }
//   ]

// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id))
//         : 0;
//     return maxId + 1;
// }

const errorHandler = (error, req, res, next) => {
    console.error("###", error.message);
    
    if(error.name === "CastError") {
        return res.status(400).send({ error: "malformed id" });
    } else if(error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.get("/api/notes", (req, res, next) => {
    Note.find({}).then(notes => {
        res.json(notes.map(note => note.toJSON()))
    })
    .catch(error => next(error))
})



app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id).then(note => {
      if(note) {
          res.json(note)
      } else {
          res.status(404).end()
      }
    })
    .catch(error => next(error))
});


app.post("/api/notes", (req, res, next) => {
    const body = req.body;

    if(body.content === undefined) {
        return res.status(400).json({
            error: "content missing"
        })
    }
    const note = new Note({
        content: body.content,
        date: new Date(),
        important: body.important || false,
    })
    console.log(note.content)
    note.save().then(savedNote => {
      res.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})

app.put("/api/notes/:id", (req, res, next) => {
    const body = req.body;
    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error));
})

app.delete("/api/notes/:id", (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)