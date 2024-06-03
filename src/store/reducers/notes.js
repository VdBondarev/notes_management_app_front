import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchNotes = createAsyncThunk('/api/notes', async ({ page, size }) => {
    const response = await fetch(`http://localhost:8088/api/notes?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return { notes: data, page, size };
});

// Modify extraReducers to handle the new structure
export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        totalCount: 0,
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
            .addCase(fetchNotes.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { } = notesSlice.actions;

export default notesSlice.reducer;
