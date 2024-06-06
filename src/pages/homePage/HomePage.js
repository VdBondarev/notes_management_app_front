import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, deleteNote, fetchNoteById } from '../../store/reducers/notes';
import { selectReducerNotes } from '../../store/selectors/notes';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app root for accessibility

export const HomePage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const size = 6;
    const [isLastPage, setIsLastPage] = useState(false);
    const notes = useSelector(selectReducerNotes);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

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
        dispatch(createNote({ title, content })).then(() => {
            dispatch(fetchNotes({ page, size }));
        }).catch(error => {
            console.error("Error creating note:", error);
        });
    };

    const handleDeleteNote = (id) => {
        dispatch(deleteNote(id)).then(() => {
            window.location.reload(); // Reload the page after deleting the note
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

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map(note => (
                    <li key={note.id} onClick={() => handleNoteClick(note.id)}>
                        {note.title}
                        <div>
                            <button className="btn edit">Edit</button>
                            <button className="btn delete" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>Delete</button>
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
                    <input
                        type="text"
                        id="title"
                        className="input"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="input"
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>
                <button className="btn add" onClick={handleAddNote}>Add a note</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Note Details"
            >
                {selectedNote && (
                    <div>
                        <h2>{selectedNote.title}</h2>
                        <p>{selectedNote.content}</p>
                        <p>Last Updated: {new Date(selectedNote.lastUpdatedAt).toLocaleDateString('en-GB')}</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
