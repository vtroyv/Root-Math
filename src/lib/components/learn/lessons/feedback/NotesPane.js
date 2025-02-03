'use client';
import { useState } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default function NotesPane() {
  // State for storing notes as objects with an id and text
  const [notes, setNotes] = useState([]);
  // State for new note text input
  const [newNoteText, setNewNoteText] = useState('');
  // State for tracking which note is being edited
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Save a new note
  const handleSaveNewNote = () => {
    if (newNoteText.trim() === '') return;
    const newNote = {
      id: Date.now(), // simple unique id
      text: newNoteText,
    };
    setNotes([...notes, newNote]);
    setNewNoteText('');
  };

  // Delete a note by filtering it out
  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  // Begin editing a note
  const handleEditNote = (noteId, currentText) => {
    setEditingNoteId(noteId);
    setEditingText(currentText);
  };

  // Save changes to an edited note
  const handleSaveEditedNote = (noteId) => {
    setNotes(
      notes.map(note =>
        note.id === noteId ? { ...note, text: editingText } : note
      )
    );
    setEditingNoteId(null);
    setEditingText('');
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingText('');
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      maxWidth: '600px', 
      margin: '1rem auto', 
      background: '#f9f9f9', 
      borderRadius: '8px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '80vh', // Fixed height for the whole notes pane
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Notes</h3>
      
      {/* Container that fills the remaining space */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden' // ensure children don't force overall container to expand
      }}>
        {/* Notes list (scrollable area) */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          paddingRight: '0.5rem', 
          marginBottom: '1rem'
        }}>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No notes yet.</p>
          ) : (
            notes
              .slice()
              .reverse() // display newest notes at the top
              .map(note =>
                editingNoteId === note.id ? (
                  <div
                    key={note.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '0.75rem',
                      marginBottom: '0.75rem',
                      background: '#fff'
                    }}
                  >
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      rows="3"
                      style={{
                        width: '100%', 
                        marginBottom: '0.5rem', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc', 
                        padding: '0.5rem'
                      }}
                    />
                    <div style={{ textAlign: 'right' }}>
                      <Button
                        color="success"
                        onClick={() => handleSaveEditedNote(note.id)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Save
                      </Button>
                      <Button color="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={() => handleEditNote(note.id, note.text)}
                    onDelete={() => handleDeleteNote(note.id)}
                  />
                )
              )
          )}
        </div>

        {/* New Note Input fixed at the bottom */}
        <div style={{ 
          borderTop: '1px solid #ddd', 
          paddingTop: '1rem',
          flexShrink: 0
        }}>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows="3"
            style={{
              width: '100%', 
              marginBottom: '0.75rem', 
              borderRadius: '4px', 
              border: '1px solid #ccc', 
              padding: '0.5rem'
            }}
            placeholder="Type your note here..."
          />
          <Button color="primary" onClick={handleSaveNewNote} style={{ width: '100%' }}>
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * NoteItem displays a single note with a subtle dropdown for editing/deleting.
 */
function NoteItem({ note, onEdit, onDelete }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prev => !prev);

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.75rem',
        marginBottom: '0.75rem',
        background: '#fff',
      }}
    >
      {/* Dropdown toggle in the top-right corner */}
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            caret
            color="link"
            style={{
              padding: 0,
              fontSize: '1.2rem',
              lineHeight: '1',
              border: 'none',
              backgroundColor: 'transparent'
            }}
          >
            &#8942;
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={onEdit}>Edit</DropdownItem>
            <DropdownItem onClick={onDelete}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <p style={{ margin: 0 }}>{note.text}</p>
    </div>
  );
}
