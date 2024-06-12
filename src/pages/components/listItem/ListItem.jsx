import React from "react";
import './ListItem.scss';

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
    <li key={note.id} onClick={() => handleNoteClick(note.id)} className="list-item">
        <div className="title">{truncateTitle(note.title)}</div>
        <div className="buttons">
            <button className="button edit" onClick={(e) => {
                e.stopPropagation();
                handleEditNote(note.id)
            }}>Edit
            </button>
            <button className="button delete" onClick={(e) => {
                e.stopPropagation();
                handleDeleteNote(note.id);
            }}>Delete
            </button>
        </div>
    </li>
)
