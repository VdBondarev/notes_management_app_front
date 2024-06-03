import {createSelector} from "@reduxjs/toolkit";

export const selectReducerNotes = createSelector(
    state => state.notes,
    notes => notes.notes,
);