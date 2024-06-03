import { useEffect, useState } from 'react';
import { fetchNotes, createNote } from "../../store/reducers/notes";
import { useDispatch, useSelector } from "react-redux";
import { selectReducerNotes } from "../../store/selectors/notes";

export const HomePage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const size = 6;
    const [isLastPage, setIsLastPage] = useState(false);
    const notes = useSelector(selectReducerNotes);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        dispatch(fetchNotes({ page, size })).then((action) => {
            const notes = action.payload.notes;
            setIsLastPage(notes.length < size);
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
            // Reload the notes list without changing the current page
            dispatch(fetchNotes({ page, size }));
        }).catch(error => {
            console.error("Error creating note:", error);
        });
    };


    return (
        <div>
            <h1>Notes List</h1>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>
                        {note.title}
                        <div>
                            <button className="btn edit">Edit</button>
                            <button className="btn delete">Delete</button>
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
                    <input
                        id="content"
                        className="input"
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button className="btn add" onClick={handleAddNote}>Add a note</button>
            </div>
        </div>
    );
};
