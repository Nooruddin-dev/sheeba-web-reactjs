

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from '../globalStore/features/user/userSlice';
import cartItemsReducer from '../globalStore/features/cartItem/cartItemsSlice';

const rootReducer = combineReducers({
    userData: userReducer,
    cartItems: cartItemsReducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  
});

export const persistedStore = persistStore(store);
