import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Product
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      console.log("Creating product with data:", productData);
      
      const response = await axios.post(
        "/api/admin/products",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Product created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create Product Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Fetch All Products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all products...");
      
      const response = await axios.get(
        "/api/admin/products",
        {
          withCredentials: true,
        }
      );

      console.log("Products fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch Products Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      console.log("Deleting product:", productId);
      
      const response = await axios.delete(
        `/api/admin/products?id=${productId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Product deleted successfully:", response.data);
      return { productId, ...response.data };
    } catch (error) {
      console.error("Delete Product Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  fetchLoading: false,
  deleteLoading: {},
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetProduct: (state) => {
      state.currentProduct = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product;
        state.success = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Fetch All Products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.products = action.payload.product || [];
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading[action.payload.productId] = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.productId
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleteLoading[productId] = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, resetProduct } = productSlice.actions;
export default productSlice.reducer;