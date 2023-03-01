import { configureStore, createSlice } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer
} from "redux-persist";

const initialState = {
    user: null,
    token: null,
    notification: null,
    chats: []
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
        },
        setNotification: (state, action) => {
            state.notification = action.payload.notification
        },
        addBoxChat: (state, action) => {
            if (state.chats.find(chat => action.payload.chat === chat)) return;
            state.chats.length >= 3 && state.chats.shift()

            state.chats.push(action.payload.chat);
        },
        removeBoxChat: (state, action) => {
            state.chats = state.chats.filter(box => box !== action.payload.chat);
        },
        clearBoxChat: (state) => {
            state.chats = [];
        }
    }
})

export const {
    setLogin,
    setLogout,
    setUser,
    setNotification,
    addBoxChat,
    removeBoxChat,
    clearBoxChat
} = authSlice.actions

const authSliceReducer = authSlice.reducer;

const persistConfig = { key: 'adzuna', storage, version: 1, whitelist: ['user', 'token', 'notification'] };
const persistedReducer = persistReducer(persistConfig, authSliceReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})

export default store