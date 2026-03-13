import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: 'dark',
}

export const ThemeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode == "light" ? "dark" : "light"
        },
        setTheme: (state, action) => {
            state.mode = action.payload
        },
    },
})

export const { toggleTheme, setTheme } = ThemeSlice.actions

export default ThemeSlice.reducer