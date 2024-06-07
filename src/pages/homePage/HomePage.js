import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, deleteNote, fetchNoteById, updateNote } from '../../store/reducers/notes';
import { selectReducerNotes } from '../../store/selectors/notes';
import Modal from 'react-modal';

export const HomePage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const size = 6;
    const [isLastPage, setIsLastPage] = useState(false);
    const notes = useSelector(selectReducerNotes);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        dispatch(fetchNotes({ page, size })).then((action) => {
            setIsLastPage(action.payload.notes.length < size);
        }).catch(error => {
            console.error("Error fetching notes:", error);
        });
    }, [dispatch, page, size]);

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage(page + 1);
        }
    };

    const handleAddNote = () => {
        if (title.trim() && content.trim()) {
            dispatch(createNote({ title, content })).then(() => {
                dispatch(fetchNotes({ page, size })).then((action) => {
                    setIsLastPage(action.payload.notes.length !== size);
                })
                setTitle('');
                setContent('');
            }).catch(error => {
                console.error("Error creating note:", error);
            });
        }
    };

    const handleDeleteNote = (id) => {
        dispatch(deleteNote(id)).then(() => {
            dispatch(fetchNotes({ page, size })).then((action) => {

                setIsLastPage(action.payload.notes.length !== size);
            })
        }).catch(error => {
            console.error("Error deleting note:", error);
        });
    };

    const handleNoteClick = (id) => {
        dispatch(fetchNoteById(id)).then((action) => {
            setSelectedNote(action.payload);
            setModalIsOpen(true);
        }).catch(error => {
            console.error("Error fetching note:", error);
        });
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedNote(null);
    };

    const handleEditNote = (id) => {
        dispatch(fetchNoteById(id)).then((action) => {
            setSelectedNote(action.payload);
            setEditTitle(action.payload.title);
            setEditContent(action.payload.content);
            setEditModalIsOpen(true);
        }).catch(error => {
            console.error("Error fetching note:", error);
        });
    };

    const handleUpdateNote = () => {
        if (editTitle.trim() && editContent.trim()) {
            dispatch(updateNote({
                id: selectedNote.id,
                note: { title: editTitle, content: editContent }
            })).then(() => {
                setEditModalIsOpen(false);
                setSelectedNote(null);
                dispatch(fetchNotes({ page, size }));
            }).catch(error => {
                console.error("Error updating note:", error);
            });
        }
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedNote(null);
    };

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => (
                    <li key={note.id} onClick={() => handleNoteClick(note.id)}>
                        {note.title}
                        <div>
                            <button className="btn edit" onClick={(e) => {
                                e.stopPropagation(); handleEditNote(note.id)
                            }}>Edit
                            </button>
                            <button className="btn delete" onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                            }}>Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 0}>←</button>
                <span>Page {page + 1}</span>
                <button onClick={handleNextPage} disabled={isLastPage}>→</button>
            </div>
            <div className="inpContainer">
                <div>
                    <label htmlFor="title">Title:</label>
                    <textarea
                        type="text"
                        id="title"
                        className="input"
                        placeholder="Cannot be empty"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '200px', height: '150px', resize: 'none'}}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="input"
                        placeholder="Cannot be empty"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{width: '200px', height: '150px', resize: 'none' }}
                    ></textarea>
                </div>
                <button className="btn add" onClick={handleAddNote} style={{height: '80px', fontSize: '15px'}}>
                    Add a note
                </button>
            </div>
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
                        <p className="note-last-updated">
                            Last updated: {new Date(selectedNote.lastUpdatedAt).toLocaleDateString('en-GB')}
                        </p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
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
                                placeholder="Cannot be empty"
                                className="input"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={{ width: '750px', height: '150px', resize: 'none'}}
                            />
                            <label htmlFor="editContent">Content:</label>
                            <textarea
                                id="editContent"
                                placeholder="Cannot be empty"
                                className="input"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                style={{ width: '750px', height: '230px', resize: 'none'}}
                            ></textarea>
                        </div>
                        <button onClick={handleUpdateNote}>Update</button>
                        <button onClick={closeEditModal}>Close</button>
                    </div>
                )}
            </Modal>
            <style jsx>{`
                .note-modal {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    right: auto;
                    bottom: auto;
                    transform: translate(-50%, -50%);
                    width: 800px;
                    height: 600px;
                    background-color: white;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow: hidden;
                }

                .note-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .note-content {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow: hidden;
                    height: 100%;
                }

                .note-title {
                    text-align: center;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .note-text-container {
                    flex-grow: 1;
                    overflow-y: auto;
                }

                .note-text {
                    white-space: pre-wrap; /* Preserve whitespace and line breaks */
                    word-wrap: break-word; /* Break long words */
                    margin-bottom: 20px;
                }

                .note-last-updated {
                    text-align: right;
                    font-size: 12px;
                    color: gray;
                    margin-top: auto;
                }
            `}</style>
        </div>
    );
};
