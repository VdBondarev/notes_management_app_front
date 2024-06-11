import React from "react";
import './ListItem.styles.scss';

export const ListItem = ({
     note,
     handleNoteClick,
     handleEditNote, handleDeleteNote, truncateTitle }) => (
    <li key={note.id} onClick={() => handleNoteClick(note.id)}>
        {truncateTitle(note.title)}
        <div>
            <button className="btn edit" onClick={(e) => {
                e.stopPropagation();
                handleEditNote(note.id)
            }}>Edit
            </button>
            <button className="btn delete" onClick={(e) => {
                e.stopPropagation();
                handleDeleteNote(note.id);
            }}>Delete
            </button>
        </div>
    </li>
)