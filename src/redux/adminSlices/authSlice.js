import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAdmin = createAsyncThunk(
  "auth/createAdmin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/admin/auth/createAdmin",
        { username, password }
      );
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminTokenTime", Date.now().toString());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/admin/auth/login",
        { username, password }
      );
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminTokenTime", Date.now().toString());
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/auth/logout");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminTokenTime");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Check if token is expired (2 days = 172800000 ms)
const isTokenExpired = () => {
  const tokenTime = localStorage.getItem("adminTokenTime");
  if (!tokenTime) return true;
  
  const expiryTime = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
  const currentTime = Date.now();
  const tokenAge = currentTime - parseInt(tokenTime);
  
  return tokenAge > expiryTime;
};

const initialState = {
  admin: null,
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('adminToken') && !isTokenExpired(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkTokenExpiry: (state) => {
      if (isTokenExpired()) {
        state.isAuthenticated = false;
        state.admin = null;
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenTime");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, checkTokenExpiry } = authSlice.actions;
export default authSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const createAdmin = createAsyncThunk(
//   "auth/createAdmin",
//   async ({ username, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "/api/admin/auth/createAdmin",
//         { username, password }
//       );
//       if (response.data.token) {
//         localStorage.setItem("adminToken", response.data.token);
//       }
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const loginAdmin = createAsyncThunk(
//   "auth/loginAdmin",
//   async ({ username, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "/api/admin/auth/login",
//         { username, password }
//       );
//       if (response.data.token) {
//         localStorage.setItem("adminToken", response.data.token);
//       }
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const logoutAdmin = createAsyncThunk(
//   "auth/logoutAdmin",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get("/api/admin/auth/logout");
//       localStorage.removeItem("adminToken");
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   admin: null,
//   isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('adminToken'),
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createAdmin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createAdmin.fulfilled, (state, action) => {
//         state.loading = false;
//         state.admin = action.payload.admin;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(createAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })
//       .addCase(loginAdmin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginAdmin.fulfilled, (state, action) => {
//         state.loading = false;
//         state.admin = action.payload.admin;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(loginAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })
//       .addCase(logoutAdmin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutAdmin.fulfilled, (state) => {
//         state.loading = false;
//         state.admin = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       })
//       .addCase(logoutAdmin.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = authSlice.actions;
// export default authSlice.reducer;