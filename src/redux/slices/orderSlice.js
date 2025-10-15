import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/api/order/ordersDetail')
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const initialState = {
    orders: [],
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || action.payload.order || [];
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearError, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;