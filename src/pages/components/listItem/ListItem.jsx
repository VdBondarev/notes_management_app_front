import React from "react";
import '../buttons.styles.scss';

const truncateTitle = (title) => {
    const maxTitleLengthBeforeTruncating = 15;
    if (title.length <= maxTitleLengthBeforeTruncating) {
        return title;
    }
    return `${title.slice(0, maxTitleLengthBeforeTruncating)}...`;
};

export const ListItem = ({
     note,
     handleNoteClick,
     handleEditNote,
     handleDeleteNote
}) => (
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
