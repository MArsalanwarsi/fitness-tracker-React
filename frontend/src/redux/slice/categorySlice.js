import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { categoryCrudApi } from "../../api/api";

const authHeader = () => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No token found");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (categoryname, { rejectWithValue }) => {
        try {
            const response = await categoryCrudApi.post("/addCategory", { name: categoryname }, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryCrudApi.get("/getUserCategory", authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    "category/updateCategory",
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const response = await categoryCrudApi.put(`/updateCategory/${id}`, { name }, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryCrudApi.delete(`/deleteCategory/${id}`, authHeader());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.category) {
                    state.categories = [action.payload.category, ...state.categories];
                }
            })
            .addCase(addCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload.category; })
            .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.category;
                if (updated) {
                    const idx = state.categories.findIndex((c) => c._id === updated._id);
                    if (idx !== -1) state.categories[idx] = updated;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((c) => c._id !== action.payload.categoryId);
            })
            .addCase(deleteCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export default categorySlice.reducer;