import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// FORGOT PASSWORD
export const forgotPass = createAsyncThunk(
    "forgot/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/forgotPassword", { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "forgot/verifyOTP",
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/verifyOTP", { email, otp });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "forgot/resetPassword",
    async ({ email, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.put("/auth/resetPassword", { email, newPassword });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const forgotSlice = createSlice({
    name: "forgot",
    initialState: {
        email: null,
        otpVerified: false,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(forgotPass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPass.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.payload.email;
            })
            .addCase(forgotPass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.email = null;
                state.otpVerified = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default forgotSlice.reducer;