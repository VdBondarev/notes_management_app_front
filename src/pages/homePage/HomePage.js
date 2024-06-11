import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, deleteNoteById, fetchNoteById, updateNoteById, searchNotes } from '../../store/reducers/notes';
import { selectReducerNotes } from '../../store/selectors/notes';
import { ListItem } from "../components/listItem/ListItem";
import { SearchContainer } from "../components/searchContainer/SearchContainer";
import { InpContainer } from "../components/inpContainer/InpContainer";
import { NoteClickModal } from "../components/modal/NoteClickModal";
import { NoteEditModal } from "../components/modal/NoteEditModal";

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
        if (title.trim() && content.trim()
            && title.length <= maxTitleLength && content.length < maxContentLength
        ) {
            const action =
                createNote( {title: title, content: content });
            dispatch(action).then(() => {
                setPage(0);
                dispatch(fetchNotes({ page: page, size: size })).then((action) => {
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
        dispatch(deleteNoteById(id)).then(() => {
            setPage(0);
            dispatch(fetchNotes({ page: page, size: size })).then((action) => {
                setIsLastPage(action.payload.notes.length !== size);
                setSearchTitle('');
                setSearchContent('');
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
            console.error("Error fetching a note:", error);
        });
    };

    const handleUpdateNote = () => {
        if (editTitle.trim() && editContent.trim()
            && editTitle.length <= maxTitleLength
            && editContent.length <= maxContentLength
        ) {
            dispatch(updateNoteById({
                id: selectedNote.id,
                note: { title: editTitle, content: editContent }
            })).then(() => {
                setEditModalIsOpen(false);
                setSelectedNote(null);
                setPage(0);
                dispatch(fetchNotes({ page: page, size: size })).then((action) => {
                    setIsLastPage(action.payload.notes.length !== size);
                    setSearchTitle('');
                    setSearchContent('');
                }).catch(error => {
                    console.log("Error fetching notes", error);
                });
            }).catch(error => {
                console.error("Error updating a note:", error);
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
            <SearchContainer
                setPage={setPage}
                searchTitle={searchTitle}
                searchContent={searchContent}
                setSearchTitle={setSearchTitle}
                setSearchContent={setSearchContent}
            />
            <ul>
                {notes.map(note => (
                    <ListItem
                        note={note}
                        handleNoteClick={handleNoteClick}
                        handleEditNote={handleEditNote}
                        handleDeleteNote={handleDeleteNote}
                    />
                ))}
            </ul>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 0}>←</button>
                <span>Page {page + 1}</span>
                <button onClick={handleNextPage} disabled={isLastPage}>→</button>
            </div>
            <InpContainer
                maxTitleLength={maxTitleLength}
                setTitle={setTitle}
                maxContentLength={maxContentLength}
                setContent={setContent}
                handleAddNote={handleAddNote}
                title={title}
                content={content}
            />
            <NoteClickModal
                closeModal={closeModal}
                selectedNote={selectedNote}
                modalIsOpen={modalIsOpen}
            />
            <NoteEditModal
                editModalIsOpen={editModalIsOpen}
                closeEditModal={closeEditModal}
                selectedNote={selectedNote}
                maxTitleLength={maxTitleLength}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                maxContentLength={maxContentLength}
                editContent={editContent}
                setEditContent={setEditContent}
                handleUpdateNote={handleUpdateNote}
            />
        </div>
    );
};
