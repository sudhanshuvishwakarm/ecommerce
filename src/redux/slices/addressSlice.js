import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAddress = createAsyncThunk(
  'address/fetchAddress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/address');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/address', addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/address', addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/address');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  address: null,
  loading: false,
  error: null,
  isEditing: false
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    clearAddress: (state) => {
      state.address = null;
      state.isEditing = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.isEditing = false;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload.address;
        state.isEditing = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.loading = false;
        state.address = null;
        state.isEditing = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setIsEditing, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;