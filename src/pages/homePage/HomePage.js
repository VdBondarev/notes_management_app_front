// pages/homePage/HomePage.js

import { useEffect, useState } from 'react';
import { fetchNotes } from "../../store/reducers/notes";
import { useDispatch, useSelector } from "react-redux";
import { selectReducerNotes } from "../../store/selectors/notes";

export const HomePage = () => {
    const dispatch = useDispatch();
    const notes = useSelector(selectReducerNotes);
    const [page, setPage] = useState(0); // State to manage the current page
    const size = 6; // Page size

    useEffect(() => {
        dispatch(fetchNotes({ page, size }));
    }, [dispatch, page, size]);

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        setPage(page + 1);
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
                <button onClick={handleNextPage}>→</button>
            </div>
            <div className="inpContainer">
                <input type="text" className="input" placeholder="Type your note" />
                <button className="btn add">Add note</button>
            </div>
        </div>
    );
};
