import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchNotes, createNote, deleteNote, fetchNoteById, updateNote, searchNotes} from '../../store/reducers/notes';
import { selectReducerNotes } from '../../store/selectors/notes';
import Modal from 'react-modal';
import "./style/homePage.css";

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
    const maxTitleLengthBeforeTruncating = 15;
    const maxTitleLength = 50;
    const maxContentLength = 20000;
    const [searchTitle, setSearchTitle] = useState('');
    const [searchContent, setSearchContent] = useState('');
    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        if (initialRender) {
            setInitialRender(false);
            return;
        }
        const action = searchTitle.trim() || searchContent.trim()
            ? searchNotes({ title: searchTitle, content: searchContent, page, size })
            : fetchNotes({ page, size });

        dispatch(action).then((action) => {
            setIsLastPage(action.payload.notes.length < size);
        }).catch(error => {
            console.error("Error fetching notes:", error);
        });
    }, [dispatch, searchTitle, searchContent, page, size, initialRender]);

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage(page + 1);
        }
    }

    const handleAddNote = () => {
        if (title.trim()
            && content.trim()
            && title.length <= maxTitleLength
            && content.length < maxContentLength
        ) {
            const action = createNote( {title: title, content: content });
            dispatch(action).then(() => {
                setPage(0);
                dispatch(fetchNotes({ page: page, size: size})).then((action) => {
                    setIsLastPage(action.payload.notes.length !== size);
                })
                setSearchTitle('');
                setSearchContent('');
                setTitle('');
                setContent('');
            }).catch(error => {
                console.error("Error creating note:", error);
            });
        }
    };

    const handleDeleteNote = (id) => {
        dispatch(deleteNote(id)).then(() => {
            dispatch(fetchNotes({page, size})).then((action) => {
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
        if (editTitle.trim() && editContent.trim()
            && editTitle.length <= maxTitleLength
            && editContent.length <= maxContentLength
        ) {
            dispatch(updateNote({
                id: selectedNote.id,
                note: {title: editTitle, content: editContent}
            })).then(() => {
                setEditModalIsOpen(false);
                setSelectedNote(null);
                dispatch(fetchNotes({page, size}));
            }).catch(error => {
                console.error("Error updating note:", error);
            });
        }
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setSelectedNote(null);
    };

    const truncateTitle = (title) => {
        if (title.length <= maxTitleLengthBeforeTruncating) {
            return title;
        }
        return `${title.slice(0, maxTitleLengthBeforeTruncating)}...`;
    };

    return (
        <div>
            <h1>Notes</h1>
            <div className="search-container">
                <div>
                    <label htmlFor="searchTitle">Title:</label>
                    <textarea
                        id="searchTitle"
                        className="input"
                        placeholder="Title"
                        value={searchTitle}
                        onChange={(e) => {
                            setSearchTitle(e.target.value);
                            setPage(0);
                        }
                        }
                        style={{width: '150px', height: '30px', resize: 'none'}}
                    />
                </div>
                <div>
                    <label htmlFor="searchContent">Content:</label>
                    <textarea
                        id="searchContent"
                        className="input"
                        placeholder="Content"
                        value={searchContent}
                        onChange={(e) => {
                            setSearchContent(e.target.value);
                            setPage(0);
                        }
                        }
                        style={{width: '150px', height: '30px', resize: 'none'}}
                    />
                </div>
            </div>
            <ul>
                {notes.map(note => (
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
                        id="title"
                        className="input"
                        placeholder={`Cannot be empty.\nMaximal length is ${maxTitleLength} symbols`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{width: '200px', height: '150px', resize: 'none'}}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="input"
                        placeholder={`Cannot be empty.\nMaximal length is ${maxContentLength} symbols`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{width: '200px', height: '150px', resize: 'none'}}
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
                        <div className="note-meta">
                            <p className="note-time-displaying">
                                Created: {new Date(selectedNote.createdAt).toLocaleString('en-GB', {dateStyle: 'medium',
                                timeStyle: 'medium'
                                })}
                            </p>
                            <p className="note-time-displaying">
                                Last updated: {new Date(selectedNote.lastUpdatedAt).toLocaleString('en-GB', {dateStyle: 'medium',
                                timeStyle: 'medium'
                                })}
                            </p>
                        </div>
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
                                style={{width: '750px', height: '230px', resize: 'none'}}
                            ></textarea>
                        </div>
                        <button onClick={handleUpdateNote}>Update</button>
                        <button onClick={closeEditModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
