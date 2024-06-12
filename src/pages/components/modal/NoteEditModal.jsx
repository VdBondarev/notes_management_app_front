import Modal from "react-modal";
import React from "react";
import './NoteModal.styles.scss';

export const NoteEditModal = ({
     editModalIsOpen,
     closeEditModal,
     selectedNote,
     maxTitleLength,
     editTitle,
     setEditTitle,
     maxContentLength,
     editContent,
     setEditContent,
     handleUpdateNote,
}) => (
    <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Note Modal"
        className="note-modal"
        overlayClassName="note-modal-overlay"
    >
        {selectedNote && (
            <div className="note-content">
                <h2 className="note-title">Edit the note</h2>
                <div className="note-text-container">
                    <label htmlFor="editTitle">Title:</label>
                    <textarea
                        id="editTitle"
                        placeholder={`Cannot be empty. Maximal length is ${maxTitleLength} symbols`}
                        className="input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{width: '750px', height: '150px', resize: 'none'}}
                    />
                    <label htmlFor="editContent">Content:</label>
                    <textarea
                        id="editContent"
                        placeholder={`Cannot be empty. Maximal length is ${maxContentLength} symbols`}
                        className="input"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{width: '750px', height: '180px', resize: 'none'}}
                    ></textarea>
                </div>
                <div className="note-meta">
                    <p className="note-time-displaying">
                        Created: {new Date(selectedNote.createdAt).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                    })}
                    </p>
                    <p className="note-time-displaying">
                        Last updated: {new Date(selectedNote.lastUpdatedAt).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                    })}
                    </p>
                </div>
                <button onClick={handleUpdateNote}>Update</button>
                <button onClick={closeEditModal}>Close</button>
            </div>
        )}
    </Modal>
)