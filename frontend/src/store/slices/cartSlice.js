import { createSlice, createAction } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addItem: (state, action) => {
      const { product, size, quantity = 1, shoeSize } = action.payload;
      const idx = state.findIndex(
        (i) => i.product === product && i.size === size
      );
      if (idx > -1) {
        state[idx].quantity += quantity;
      } else {
        state.push({
          product,
          name: product.name || 'Product',
          price: product.price || 0,
          image: product.image || '',
          size,
          quantity,
          shoeSize: shoeSize || '',
        });
      }
    },
    updateQty: (state, action) => {
      const { product, size, quantity } = action.payload;
      state.forEach((i) =>
        i.product === product && i.size === size
          ? (i.quantity = Math.max(1, quantity))
          : i
      );
    },
    removeItem: (state, action) => {
      const { product, size } = action.payload;
      return state.filter(
        (i) => !(i.product === product && i.size === size)
      );
    },
    clearCart: (state) => {
      return [];
    },
  },
});

export const { addItem, updateQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;