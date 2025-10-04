import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/product/getProductsByCategory', category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/product/productDetail', { productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilar',
  async ({ category, currentProductId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/product/getProductsByCategory', category);
      const filteredProducts = response.data
        .filter(item => item._id !== currentProductId)
        .slice(0, 4);
      return filteredProducts;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  similarProducts: [],
  loading: false,
  productDetailLoading: false,
  similarProductsLoading: false,
  error: null,
  filters: {
    color: [],
    size: [],
    price: null,
    discount: null,
    availability: null
  },
  sortBy: 'Most Popular'
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        color: [],
        size: [],
        price: null,
        discount: null,
        availability: null
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductDetail.pending, (state) => {
        state.productDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.productDetailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.productDetailLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarProductsLoading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProductsLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.similarProductsLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setFilters, clearFilters, setSortBy, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;