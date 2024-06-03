import {useEffect} from 'react';
import {fetchNotes} from "../../store/reducers/notes";
import {useDispatch, useSelector} from "react-redux";
import {selectReducerNotes} from "../../store/selectors/notes";

export const HomePage = () => {
    const dispatch = useDispatch();
    const notes = useSelector(selectReducerNotes);

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    return (<div>
        <h1>Notes List</h1>
        <ul>
            {notes.map(note => (<li key={note.id}>
                    {note.title}
                    <div>
                        <button className="btn edit">Edit</button>
                        <button className="btn delete">Delete</button>
                    </div>
                </li>))}
        </ul>
        <div className="inpContainer">
            <input type="text" className="input" placeholder="Type your note" />
            <button className="btn add">Add note</button>
        </div>
    </div>
)
}
