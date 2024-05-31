import { createSlice } from "@reduxjs/toolkit";

interface CartState {
    cartItems: any[]; // Define the structure of cart items as per your requirements
}

const initialState: CartState = {
    cartItems: []
};

export const cartItemsSlice = createSlice({
    name: "cartItems",
    initialState,
    reducers: {
        addItemToCartRedux: (state, action) => {
            state.cartItems.push(action.payload);
        },
        removeCartItemFromRedux: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.productId !== action.payload.productId);
        },
        updateCartItemInRedux: (state, action) => {
            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
            if (index !== -1) {
                state.cartItems[index] = action.payload;
            }
        },
        clearCartItemsRedux: (state) => {
            state.cartItems = [];
        },
    },
});

export const { addItemToCartRedux, removeCartItemFromRedux, updateCartItemInRedux, clearCartItemsRedux } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;


// ✅  --How to use each method in the application
//  const handleaddItemToCartRedux = (item) => {
//     dispatch(addItemToCartRedux(item)); 
// };

// const handleremoveCartItemFromRedux = (itemId) => {
//     dispatch(removeCartItemFromRedux({ id: itemId })); 
// };

// const handleupdateCartItemInRedux = (item) => {
//     dispatch(updateCartItemInRedux(item)); 
// };

// const handleclearCartItemsRedux = () => {
//     dispatch(clearCartItemsRedux()); 
// };