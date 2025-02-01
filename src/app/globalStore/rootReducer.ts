

import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../globalStore/features/user/userSlice';
import cartItemsReducer from '../globalStore/features/cartItem/cartItemsSlice';
import loaderReducer from '../globalStore/features/loader/loaderSlice';


const rootReducer = combineReducers({
    userData: userReducer,
    cartItems: cartItemsReducer,
    loader: loaderReducer,
 
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;