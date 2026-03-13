import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from './slice/ThemeSlice'

export const store = configureStore({
    reducer: {
        theme: ThemeReducer
    },
})