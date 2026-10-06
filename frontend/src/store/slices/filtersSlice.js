import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    category: '',
    gender: 'Unisex',
    sortBy: 'latest',
    priceMin: 0,
    priceMax: Infinity,
    searchQuery: '',
    page: 1,
    limit: 20,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.priceMin = min;
      state.priceMax = max;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
  },
});

export const {
  setCategory,
  setGender,
  setSortBy,
  setPriceRange,
  setSearchQuery,
  setPage,
  setLimit,
} = filtersSlice.actions;
export default filtersSlice.reducer;