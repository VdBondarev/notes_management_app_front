import { configureStore } from '@reduxjs/toolkit';
import notes from './reducers/notes';

export const store = configureStore({
    reducer: {
        notes
    },
});
