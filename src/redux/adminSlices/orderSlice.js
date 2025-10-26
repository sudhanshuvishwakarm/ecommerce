import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
  "adminOrder/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all orders...");
      
      const response = await axios.get(
        "/api/admin/orders",
        {
          withCredentials: true,
        }
      );

      console.log("Orders fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch Orders Error:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenTime');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      console.log("Updating order status:", orderId, status);
      
      const response = await axios.post(
        `/api/admin/orders?id=${orderId}`,
        { orderStatus: status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Order status updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update Order Status Error:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenTime');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  "adminOrder/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log("Deleting order:", orderId);
      
      const response = await axios.delete(
        `/api/admin/orders?id=${orderId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Order deleted successfully:", response.data);
      return { orderId, ...response.data };
    } catch (error) {
      console.error("Delete Order Error:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenTime');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  updateLoading: {},
  deleteLoading: {},
  error: null,
  success: false,
};

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Orders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updateLoading[action.meta.arg.orderId] = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const orderId = action.meta.arg.orderId;
        state.updateLoading[orderId] = false;
        
        const orderIndex = state.orders.findIndex(o => o._id === orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].orderStatus = action.payload.order.orderStatus;
        }
        state.success = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        const orderId = action.meta.arg.orderId;
        state.updateLoading[orderId] = false;
        state.error = action.payload;
      });

    // Delete Order
    builder
      .addCase(deleteOrder.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteLoading[action.payload.orderId] = false;
        state.orders = state.orders.filter(
          (o) => o._id !== action.payload.orderId
        );
        state.success = true;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        const orderId = action.meta.arg;
        state.deleteLoading[orderId] = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;