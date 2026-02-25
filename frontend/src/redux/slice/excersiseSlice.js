import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {exceriseApi} from "../../api/api";


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


const excersiseSlice = createSlice({
    name: "excersise",
    initialState: {
        excersises: [],
        equipments: [],
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
    }
});

export default excersiseSlice.reducer;