import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//PROFILE
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('auth_token');
    
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

// authSlice.js
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    const token = Cookies.get('auth_token');
    if (!token) return rejectWithValue("No token found");

    try {
      const response = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      Cookies.remove('auth_token'); 
      return rejectWithValue(error.response?.data || "Session expired");
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async (formData, { rejectWithValue }) => {
    const token = Cookies.get('auth_token');
    if (!token) return rejectWithValue("No token found");
    try {
      const response = await api.put("/auth/profile/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile image");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAdmin:false,
    loggedIn:false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAdmin=false;
      state.loggedIn = false;
      state.error = null;
      Cookies.remove('auth_token');
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn=true;
        state.user = action.payload;
        if(state.user.user.role=="admin"){
          state.isAdmin=true
        }else{
          state.isAdmin=false
        };
        const token=state.user.token;
        const decoded = jwtDecode(token);
        const expirationDate = new Date(decoded.exp * 1000);
        Cookies.set('auth_token', token, { 
        expires: expirationDate,
        secure: true,
        sameSite: 'strict'
    });
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // PROFILE
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
         if(state.user.user.role=="admin"){
          state.isAdmin=true
        }else{
          state.isAdmin=false
        };
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // CHECK AUTH STATUS
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(checkAuthStatus.fulfilled, (state, action) => {
  state.loading = false;
  state.loggedIn = true;
  state.user = action.payload;
  state.isAdmin = action.payload.user.role === "admin";
})
.addCase(checkAuthStatus.rejected, (state) => {
  state.loading = false;
  state.loggedIn = false;
  state.user = null;
})
    // UPDATE PROFILE IMAGE
    .addCase(updateProfileImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
