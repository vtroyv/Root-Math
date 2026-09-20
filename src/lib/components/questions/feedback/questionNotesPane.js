'use client';
import { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col} from 'reactstrap';

export default function QuestionNotesPane() {
  const [notes, setNotes] = useState([]);          // [{id, latex}]
  const [editingNoteId, setEditingNoteId] = useState(null);

  // --- New note MFE ---
  const newMfeRef = useRef(null);
  const newMfeContainerRef = useRef(null);

  useEffect(() => {
    if (!newMfeRef.current) {
      newMfeRef.current = new MathfieldElement({
        mathModeSpace: '\\,',
        mathVirtualKeyboardPolicy: 'manual',
        // defaultMode:'text',
      });

    

      

      const mf = newMfeRef.current;
      mf.placeholder = 'Write your notes here...';
      Object.assign(mf.style, {
        display: 'block',
        width: '100%',
        minHeight: '3rem',
        backgroundColor: '#fff',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      });

      // mf.addEventListener('pointerdown', (ev) => {
      //   ev.preventDefault();
      //   mf.focus();
      //   const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY);
      //   mf.position = offset;
      // });

      mf.addEventListener('input', (event) => {
        if (event.inputType === 'insertLineBreak') {
          mf.executeCommand('addRowAfter');
          // event.preventDefault();
        }
      });

      mf.addEventListener('pointerdown', (ev) => {
      // ev.preventDefault();
  
      const offset = mf.getOffsetFromPoint(ev.clientX, ev.clientY);
      if (offset != null && offset >= 0) {
        mf.position = offset;
      }
          mf.focus();
    });

      if (newMfeContainerRef.current && !newMfeContainerRef.current.contains(mf)) {
        newMfeContainerRef.current.appendChild(mf);
        // mf.focus();
      }
    }
  }, []);

  const handleCreateNewNote = () => {
    const latex = newMfeRef.current?.getValue
      ? newMfeRef.current.getValue('latex')
      : newMfeRef.current?.value;
    if (!latex || latex.trim() === '') return;

    setNotes((prev) => [...prev, { id: Date.now(), latex }]);
    newMfeRef.current.setValue("")
    
    newMfeRef.current.focus();
  };

  const handleDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (editingNoteId === noteId) setEditingNoteId(null);
  };

  

  return (
    <div style={{
      padding: '1.5rem',
      margin: '1rem auto',
      background: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Notes</h3>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem' }}>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No notes yet.</p>
          ) : (
            notes
              .slice()
              .reverse()
              .map((note) =>
                editingNoteId === note.id ? (
                  <EditNoteItem
                    key={note.id}
                    note={note}
                    onSave={(latex) => {
                      setNotes((prev) =>
                        prev.map((n) => (n.id === note.id ? { ...n, latex } : n))
                      );
                      setEditingNoteId(null);
                    }}
                    onCancel={() => setEditingNoteId(null)}
                  />
                ) : (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={() => setEditingNoteId(note.id)}
                    onDelete={() => handleDeleteNote(note.id)}
                  />
                )
              )
          )}
        </div>

        {/* New Note editor */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem', flexShrink: 0, }}>
          <div
            ref={newMfeContainerRef}
            style={{ width: '100%', marginBottom: '0.75rem' }}
           
          />
      
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'space-between'}}>
              <ModeToggle mathfieldRef={newMfeRef}/>
          <Button color="primary" onClick={handleCreateNewNote} style={{ width: '100%' }}>
            Create Note
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Read-only note display */
function NoteItem({ note, onEdit, onDelete }) {
  const hostRef = useRef(null);
  const mfe = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!mfe.current) {
      mfe.current = new MathfieldElement({ readOnly: true });
      mfe.current.placeholder ="Write your notes here..."
      mfe.current.value = note.latex;
      Object.assign(mfe.current.style, {
        display: 'block',
        width: '100%',
        minHeight: '2rem',
        backgroundColor: 'transparent',
        border: 'none',
      });
   


      if (hostRef.current && !hostRef.current.contains(mfe.current)) {
        hostRef.current.appendChild(mfe.current);
        mfe.current.focus()
      }
    } else {
      mfe.current.setValue(note.latex || '');
    }
  }, [note.latex]);

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
      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
          <DropdownToggle
            caret
            color="link"
            style={{
              padding: 0,
              fontSize: '1.2rem',
              lineHeight: '1',
              border: 'none',
              backgroundColor: 'transparent',
            }}
          >
            ⋮
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={onEdit}>Edit</DropdownItem>
            <DropdownItem onClick={onDelete}>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div ref={hostRef} />
    </div>
  );
}

/** Editable note */
function EditNoteItem({ note, onSave, onCancel }) {
  const hostRef = useRef(null);
  const mfe = useRef(null);

  useEffect(() => {
    if (!mfe.current) {
      mfe.current = new MathfieldElement({
        mathModeSpace: '\\,',
        mathVirtualKeyboardPolicy: 'manual',
      });

      mfe.current.placeholder='Write your notes here...';

      Object.assign(mfe.current.style, {
        display: 'block',
        width: '100%',
        minHeight: '3rem',
        backgroundColor: '#fff',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
      });
      mfe.current.value = note.latex || '';



       mfe.current.addEventListener('input', (event) => {
        if (event.inputType === 'insertLineBreak') {
          mfe.current.executeCommand('addRowAfter');
          // event.preventDefault();
        }
      
      });

      mfe.current.addEventListener('pointerdown', (ev) => {
        ev.preventDefault()
    
        mfe.current.focus();
        const offset = mfe.current.getOffsetFromPoint(ev.clientX, ev.clientY);
        mfe.current.position = offset;
      });

      if (hostRef.current && !hostRef.current.contains(mfe.current)) {
        hostRef.current.appendChild(mfe.current);
        mfe.current.focus();
      }
    } else {
      mfe.current.setValue(note.latex || '');
    }
  }, [note.id]);

  const saveNote = () => {
    const latex = mfe.current?.getValue
      ? mfe.current.getValue('latex')
      : mfe.current?.value;
    onSave(latex || '');
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '0.75rem',
        marginBottom: '0.75rem',
        background: '#fff',
      }}
    >
      <div ref={hostRef} style={{ marginBottom: '0.5rem' }} />
      <div style={{ textAlign: 'right' }}>
        <Button color="success" onClick={saveNote} style={{ marginRight: '0.5rem' }}>
          Save
        </Button>
        <Button color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function ModeToggle({ mathfieldRef }) {
  const [isTextMode, setIsTextMode] = useState(false);

  const handleChange = (e) => {
    const checked = e.target.checked;
    setIsTextMode(checked);

    const mf = mathfieldRef.current;
    if (!mf) return;

    mf.mode = checked ? 'text' : 'math';
    mf.focus();
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',        // <-- keeps text + checkbox aligned
        gap: '0.4rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '0px',
        border: '1px solid #ccc',
        background: '#f7f7f7',
        minWidth: '110px',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontSize: '0.9rem',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        Text mode
      </span>

      <input
  type="checkbox"
  checked={isTextMode}
  onChange={handleChange}
  style={{
    margin: 0,
    width: '16px',
    height: '16px',
    transform: 'translateY(1px)', // tweak 0.5–2px to taste
  }}
/>
    </label>
  );
}
