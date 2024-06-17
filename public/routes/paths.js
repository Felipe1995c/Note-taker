const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dbPath = path.join(__dirname, '../../db/db.json');

// Get all notes
router.get('/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Add a new note
router.post('/notes', (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
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
router.delete('/notes/:id', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read notes' });
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== req.params.id);

      fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to delete note' });
        } else {
          res.json({ message: 'Note deleted successfully' });
        }
      });
    }
  });
});

module.exports = router;