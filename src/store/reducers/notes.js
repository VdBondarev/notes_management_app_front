import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


export const fetchNotes = createAsyncThunk('/api/notes', async () => {
    const response = await fetch('http://localhost:8088/api/notes');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
});


export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'idle';
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state) => {
                state.status = 'failed';
            })
    },
});

export const {  } = notesSlice.actions;

export default notesSlice.reducer;