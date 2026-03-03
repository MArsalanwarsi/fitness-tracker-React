import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exceriseApi, excesiseCrudApi } from "../../api/api";
import Cookies from 'js-cookie';


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
            const response = await exceriseApi.get("/exercises/search", {
                params: { q: search },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addExcersise = createAsyncThunk(
    "excersise/addExcersise",
    async (excersiseData, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');

        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const response = await excesiseCrudApi.post("/addExcersise", excersiseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserExcersises = createAsyncThunk(
    "excersise/fetchUserExcersises",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const response = await excesiseCrudApi.get("/getUserExcersises", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
export const deleteExcersise = createAsyncThunk(
    "excersise/deleteExcersise",
    async (excersiseId, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const response = await excesiseCrudApi.delete(`/deleteExcersise/${excersiseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
            .addCase(fetchEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.equipments = action.payload.data;
            })
            .addCase(fetchEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchExcersises.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExcersises.fulfilled, (state, action) => {
                state.loading = false;
                state.excersises = action.payload.data;
            })
            .addCase(fetchExcersises.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addExcersise.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExcersise.fulfilled, (state, action) => {
                state.loading = false;
                state.userExcersises = action.payload.data;
                console.log(action.payload);
                
            })
            .addCase(addExcersise.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserExcersises.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserExcersises.fulfilled, (state, action) => {
                state.loading = false;
                state.userExcersises = action.payload.excersises;
            })
            .addCase(fetchUserExcersises.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getExcersiseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExcersiseById.fulfilled, (state, action) => {
                state.loading = false;
                state.excersisebyId = action.payload.data;
            })
            .addCase(getExcersiseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteExcersise.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExcersise.fulfilled, (state, action) => {
                state.loading = false;
                state.userExcersises = state.userExcersises.filter(ex => ex._id !== action.payload.excersiseId);
            })
            .addCase(deleteExcersise.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default excersiseSlice.reducer;