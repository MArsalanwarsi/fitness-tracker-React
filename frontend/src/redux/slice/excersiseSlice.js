import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exceriseApi, excesiseCrudApi } from "../../api/api";
import Cookies from "js-cookie";

const authHeader = () => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No token found");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchEquipment = createAsyncThunk(
    "excersise/fetchEquipment",
    async (_, { rejectWithValue }) => {
        try {
            const response = await exceriseApi.get("/equipments");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchExcersises = createAsyncThunk(
    "excersise/fetchExcersises",
    async (search, { rejectWithValue }) => {
        try {
            const response = await exceriseApi.get("/exercises/search", { params: { q: search } });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addExcersise = createAsyncThunk(
    "excersise/addExcersise",
    async (excersiseData, { rejectWithValue }) => {
        try {
            const response = await excesiseCrudApi.post("/addExcersise", excersiseData, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserExcersises = createAsyncThunk(
    "excersise/fetchUserExcersises",
    async (_, { rejectWithValue }) => {
        try {
            const response = await excesiseCrudApi.get("/getUserExcersises", authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getExcersiseById = createAsyncThunk(
    "excersise/getExcersiseById",
    async (excersiseId, { rejectWithValue }) => {
        try {
            const response = await exceriseApi.get(`exercises/${excersiseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateExcersise = createAsyncThunk(
    "excersise/updateExcersise",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await excesiseCrudApi.put(`/updateExcersise/${id}`, data, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteExcersise = createAsyncThunk(
    "excersise/deleteExcersise",
    async (excersiseId, { rejectWithValue }) => {
        try {
            const response = await excesiseCrudApi.delete(`/deleteExcersise/${excersiseId}`, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const excersiseSlice = createSlice({
    name: "excersise",
    initialState: {
        excersises: [],
        equipments: [],
        userExcersises: [],
        excersisebyId: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipment.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchEquipment.fulfilled, (state, action) => { state.loading = false; state.equipments = action.payload.data; })
            .addCase(fetchEquipment.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchExcersises.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchExcersises.fulfilled, (state, action) => { state.loading = false; state.excersises = action.payload.data; })
            .addCase(fetchExcersises.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(addExcersise.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addExcersise.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.excersise) {
                    state.userExcersises = [action.payload.excersise, ...state.userExcersises];
                }
            })
            .addCase(addExcersise.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchUserExcersises.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUserExcersises.fulfilled, (state, action) => { state.loading = false; state.userExcersises = action.payload.excersises; })
            .addCase(fetchUserExcersises.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(getExcersiseById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getExcersiseById.fulfilled, (state, action) => { state.loading = false; state.excersisebyId = action.payload.data; })
            .addCase(getExcersiseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateExcersise.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateExcersise.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.excersise;
                if (updated) {
                    const idx = state.userExcersises.findIndex((ex) => ex._id === updated._id);
                    if (idx !== -1) state.userExcersises[idx] = updated;
                }
            })
            .addCase(updateExcersise.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteExcersise.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteExcersise.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload.excersiseId;
                state.userExcersises = state.userExcersises.filter((ex) => ex._id !== deletedId);
            })
            .addCase(deleteExcersise.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default excersiseSlice.reducer;