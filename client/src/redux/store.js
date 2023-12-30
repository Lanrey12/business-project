import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../redux/user/userSlice'
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store)
// The persist reducer allows the state in the store to be stored in the localstorage, 
// So the state doesn't change when a user refreshes it only updates the dom 
//so basically it works like handling sessions 