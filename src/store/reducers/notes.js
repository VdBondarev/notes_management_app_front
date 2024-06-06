import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async ({ page, size }) => {
    const response = await fetch(`http://localhost:8088/api/notes?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { notes: data, page, size };
});

export const createNote = createAsyncThunk('notes/create', async ({ title, content }) => {
    const response = await fetch('http://localhost:8088/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
        throw new Error('Failed to create note');
    }
    return await response.json();
});

export const fetchNoteById = createAsyncThunk('notes/fetchNoteById', async (id) => {
    const response = await fetch(`http://localhost:8088/api/notes/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

export const deleteNote = createAsyncThunk('notes/delete', async (id) => {
    const response = await fetch(`http://localhost:8088/api/notes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete note');
    }
    return id;
});

export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        totalCount: 0,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = action.payload.notes;
                state.totalCount = action.payload.notes.length;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(createNote.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes.push(action.payload);
                state.totalCount++;
            })
            .addCase(createNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteNote.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = state.notes.filter(note => note.id !== action.payload);
                state.totalCount--;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchNoteById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNoteById.fulfilled, (state, action) => {
                state.status = 'idle';
                state.selectedNote = action.payload;
            })
            .addCase(fetchNoteById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default notesSlice.reducer;
