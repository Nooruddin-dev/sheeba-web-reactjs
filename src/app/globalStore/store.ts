

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from '../globalStore/features/user/userSlice';
import cartItemsReducer from '../globalStore/features/cartItem/cartItemsSlice';
import loaderReducer from "../globalStore/features/loader/loaderSlice";

const rootReducer = combineReducers({
    userData: userReducer,
    cartItems: cartItemsReducer,
    loader: loaderReducer,
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
