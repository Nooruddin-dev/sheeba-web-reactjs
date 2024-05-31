

import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../globalStore/features/user/userSlice';
import cartItemsReducer from '../globalStore/features/cartItem/cartItemsSlice';


const rootReducer = combineReducers({
    userData: userReducer,
    cartItems: cartItemsReducer,
 
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;