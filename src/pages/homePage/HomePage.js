import { useEffect, useState } from 'react';
import { fetchNotes } from "../../store/reducers/notes";
import { useDispatch, useSelector } from "react-redux";
import { selectReducerNotes } from "../../store/selectors/notes";

export const HomePage = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const size = 6;
    const [isLastPage, setIsLastPage] = useState(false);
    const notes = useSelector(selectReducerNotes);

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
                <input type="text" className="input" placeholder="Type your note" />
                <button className="btn add">Add a note</button>
            </div>
        </div>
    );
};
