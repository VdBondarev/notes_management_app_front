import Modal from "react-modal";
import React from "react";
import './NoteModal.styles.scss';

export const NoteClickModal = ({
    modalIsOpen,
    closeModal,
    selectedNote
}) => (
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Note Details"
        className="note-modal"
        overlayClassName="note-modal-overlay"
    >
        {selectedNote && (
            <div className="note-content">
                <h2 className="note-title">{selectedNote.title}</h2>
                <div className="note-text-container">
                    <p className="note-text">{selectedNote.content}</p>
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
                <button onClick={closeModal}>Close</button>
            </div>
        )}
    </Modal>
)
