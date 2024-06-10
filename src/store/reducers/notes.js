import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8088/api";
const lastUpdatedAtFieldName = "lastUpdatedAt"

export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes', async ({ page, size }) => {
    const sortingByLastUpdatedAt = `sort=${lastUpdatedAtFieldName},DESC`;
    const response = await fetch(API_URL + `/notes?page=${page}&size=${size}&${sortingByLastUpdatedAt}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { notes: data, page, size };
});

export const createNote = createAsyncThunk(
    'notes/create', async ({ title, content }) => {
    const response = await fetch(API_URL + '/notes', {
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

export const fetchNoteById = createAsyncThunk(
    'notes/fetchNoteById', async (id) => {
    const response = await fetch(API_URL + `/notes/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
});

export const deleteNoteById = createAsyncThunk(
    'notes/delete', async (id) => {
    const response = await fetch(API_URL + `/notes/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete note');
    }
    return id;
});

export const updateNoteById = createAsyncThunk(
    'notes/updateNote', async ({ id, note }) => {
    const response = await fetch(API_URL + `/notes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    });
    if (!response.ok) {
        throw new Error('Failed to update note');
    }
    return await response.json();
});

export const searchNotes = createAsyncThunk(
    'notes/search', async ({ title, content, page, size }) => {
    const query = new URLSearchParams();
    if (title) {
        query.append('title', title);
    }
    if (content) {
        query.append('content', content);
    }
    if (page !== undefined) {
        query.append('page', page);
    }
    if (size !== undefined) {
        query.append('size', size);
    }
    query.append('sort', `${lastUpdatedAtFieldName},DESC`);
    const response = await fetch(API_URL + `/notes/search?${query.toString()}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { notes: data, page, size };
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
            .addCase(deleteNoteById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteNoteById.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = state.notes.filter(note => note.id !== action.payload);
                state.totalCount--;
            })
            .addCase(deleteNoteById.rejected, (state, action) => {
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
            })
            .addCase(updateNoteById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateNoteById.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = state.notes.map(note => note.id === action.payload.id ? action.payload : note);
                if (state.selectedNote && state.selectedNote.id === action.payload.id) {
                    state.selectedNote = action.payload;
                }
            })
            .addCase(updateNoteById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(searchNotes.pending, (state) => {
                state.searchStatus = 'loading';
            })
            .addCase(searchNotes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = action.payload.notes;
            })
            .addCase(searchNotes.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.searchError = action.error.message;
            });
    },
});

export default notesSlice.reducer;
