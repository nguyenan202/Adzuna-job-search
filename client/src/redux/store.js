import { configureStore, createSlice } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer
} from "redux-persist";

const initialState = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setUser: (state, action) => {
            state.user = action.payload.user
        }
    }
})

export const {
    setLogin,
    setLogout,
    setUser
} = authSlice.actions

const authSliceReducer = authSlice.reducer

const persistConfig = { key: 'adzuna', storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authSliceReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store