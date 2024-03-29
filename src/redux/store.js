import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import skillsReducer from './features/skillsSlice';
import projectReducer from './features/projectSlice';
import designReducer from './features/designSlice';
import hiremeReducer from './features/hiremeSlice';

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({ 
    skills: skillsReducer,
    projects: projectReducer,
    designs: designReducer,
    contact: hiremeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export let persistor = persistStore(store);