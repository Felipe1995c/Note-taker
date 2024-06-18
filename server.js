const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all notes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to save note' });
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== req.params.id);

      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to delete note' });
        } else {
          res.json({ message: 'Note deleted successfully' });
        }
      });
    }
  });
});

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});