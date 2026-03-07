import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import api from "../../api/api";
import Cookies from 'js-cookie';
const BASE = "/nutrition";

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ─────────────────────────────────────────────────────────────────────────────

// ── Current-day nutrition ─────────────────────────────────────────────────────

export const fetchNutrition = createAsyncThunk(
    "nutrition/fetchNutrition",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(BASE, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.nutrition;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const fetchTodaySummary = createAsyncThunk(
    "nutrition/fetchTodaySummary",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(`${BASE}/summary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.summary;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// body: { name, calories, protein, carbs, fats }
export const addFoodToMeal = createAsyncThunk(
    "nutrition/addFoodToMeal",
    async ({ meal, foodData }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.post(`${BASE}/${meal}`, foodData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { meal, item: data.item };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// body: { name?, calories?, protein?, carbs?, fats? }
export const updateFoodInMeal = createAsyncThunk(
    "nutrition/updateFoodInMeal",
    async ({ meal, foodId, updates }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/${meal}/${foodId}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { meal, item: data.item };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const deleteFoodFromMeal = createAsyncThunk(
    "nutrition/deleteFoodFromMeal",
    async ({ meal, foodId }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/${meal}/${foodId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { meal, foodId };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const clearMeal = createAsyncThunk(
    "nutrition/clearMeal",
    async (meal, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/${meal}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return meal;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// ── Daily logs ────────────────────────────────────────────────────────────────

// params: { limit?, from?, to? }
export const fetchAllLogs = createAsyncThunk(
    "nutrition/fetchAllLogs",
    async (params = {}, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(`${BASE}/logs`, { params, headers: { Authorization: `Bearer ${token}` } });
            return data.logs;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const fetchTodayLog = createAsyncThunk(
    "nutrition/fetchTodayLog",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(`${BASE}/logs/today`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.log;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// params: { days? }
export const fetchLogsSummary = createAsyncThunk(
    "nutrition/fetchLogsSummary",
    async (days = 7, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(`${BASE}/logs/summary`, { params: { days }, headers: { Authorization: `Bearer ${token}` } });
            return data.data; // array of { date, calories, protein, carbs, fats }
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const fetchLogById = createAsyncThunk(
    "nutrition/fetchLogById",
    async (logId, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(`${BASE}/logs/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.log;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// body: { date? }
export const createLog = createAsyncThunk(
    "nutrition/createLog",
    async (date = null, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.post(`${BASE}/logs`, date ? { date } : {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data.log;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// body: { name, calories, protein, carbs, fats }
export const addFoodToLog = createAsyncThunk(
    "nutrition/addFoodToLog",
    async ({ logId, meal, foodData }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.post(`${BASE}/logs/${logId}/${meal}`, foodData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { logId, meal, item: data.item };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// body: { name?, calories?, protein?, carbs?, fats? }
export const updateFoodInLog = createAsyncThunk(
    "nutrition/updateFoodInLog",
    async ({ logId, meal, foodId, updates }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/logs/${logId}/${meal}/${foodId}`, updates, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { logId, meal, item: data.item };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const deleteFoodFromLog = createAsyncThunk(
    "nutrition/deleteFoodFromLog",
    async ({ logId, meal, foodId }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/logs/${logId}/${meal}/${foodId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { logId, meal, foodId };
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

export const deleteLog = createAsyncThunk(
    "nutrition/deleteLog",
    async (logId, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/logs/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return logId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const initialState = {
    // Current-day nutrition
    nutrition: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
    },
    summary: null,        // { calories, protein, carbs, fats, byMeal: {} }

    // Daily logs
    logs: [],    // all logs array
    todayLog: null,  // today's log object
    selectedLog: null,  // log opened by ID
    logsSummary: [],    // chart data [{ date, calories, protein, carbs, fats }]

    // UI state
    loading: false,
    logLoading: false,
    error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Replace a food item inside a log's meal array by _id
const replaceFoodInLog = (logs, logId, meal, updatedItem) =>
    logs.map((log) => {
        if (log._id !== logId) return log;
        return {
            ...log,
            [meal]: log[meal].map((item) =>
                item._id === updatedItem._id ? updatedItem : item
            ),
        };
    });

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────

const nutritionSlice = createSlice({
    name: "nutrition",
    initialState,

    reducers: {
        clearError: (state) => { state.error = null; },
        clearSelectedLog: (state) => { state.selectedLog = null; },
    },

    extraReducers: (builder) => {

        // ── Generic pending/rejected helpers ─────────────────────────────────────
        const pending = (state) => { state.loading = true; state.error = null; };
        const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

        // ── fetchNutrition ────────────────────────────────────────────────────────
        builder
            .addCase(fetchNutrition.pending, pending)
            .addCase(fetchNutrition.rejected, rejected)
            .addCase(fetchNutrition.fulfilled, (state, action) => {
                state.loading = false;
                state.nutrition = action.payload;
            });

        // ── fetchTodaySummary ─────────────────────────────────────────────────────
        builder
            .addCase(fetchTodaySummary.pending, pending)
            .addCase(fetchTodaySummary.rejected, rejected)
            .addCase(fetchTodaySummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
            });

        // ── addFoodToMeal ─────────────────────────────────────────────────────────
        builder
            .addCase(addFoodToMeal.pending, pending)
            .addCase(addFoodToMeal.rejected, rejected)
            .addCase(addFoodToMeal.fulfilled, (state, action) => {
                state.loading = false;
                const { meal, item } = action.payload;
                state.nutrition[meal].push(item);
            });

        // ── updateFoodInMeal ──────────────────────────────────────────────────────
        builder
            .addCase(updateFoodInMeal.pending, pending)
            .addCase(updateFoodInMeal.rejected, rejected)
            .addCase(updateFoodInMeal.fulfilled, (state, action) => {
                state.loading = false;
                const { meal, item } = action.payload;
                state.nutrition[meal] = state.nutrition[meal].map((f) =>
                    f._id === item._id ? item : f
                );
            });

        // ── deleteFoodFromMeal ────────────────────────────────────────────────────
        builder
            .addCase(deleteFoodFromMeal.pending, pending)
            .addCase(deleteFoodFromMeal.rejected, rejected)
            .addCase(deleteFoodFromMeal.fulfilled, (state, action) => {
                state.loading = false;
                const { meal, foodId } = action.payload;
                state.nutrition[meal] = state.nutrition[meal].filter(
                    (f) => f._id !== foodId
                );
            });

        // ── clearMeal ─────────────────────────────────────────────────────────────
        builder
            .addCase(clearMeal.pending, pending)
            .addCase(clearMeal.rejected, rejected)
            .addCase(clearMeal.fulfilled, (state, action) => {
                state.loading = false;
                state.nutrition[action.payload] = [];
            });

        // ── fetchAllLogs ──────────────────────────────────────────────────────────
        builder
            .addCase(fetchAllLogs.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(fetchAllLogs.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(fetchAllLogs.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logs = action.payload;
            });

        // ── fetchTodayLog ─────────────────────────────────────────────────────────
        builder
            .addCase(fetchTodayLog.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(fetchTodayLog.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(fetchTodayLog.fulfilled, (state, action) => {
                state.logLoading = false;
                state.todayLog = action.payload;
                // also upsert into logs array
                const idx = state.logs.findIndex((l) => l._id === action.payload._id);
                if (idx !== -1) state.logs[idx] = action.payload;
                else state.logs.unshift(action.payload);
            });

        // ── fetchLogsSummary ──────────────────────────────────────────────────────
        builder
            .addCase(fetchLogsSummary.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(fetchLogsSummary.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(fetchLogsSummary.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logsSummary = action.payload;
            });

        // ── fetchLogById ──────────────────────────────────────────────────────────
        builder
            .addCase(fetchLogById.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(fetchLogById.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(fetchLogById.fulfilled, (state, action) => {
                state.logLoading = false;
                state.selectedLog = action.payload;
            });

        // ── createLog ─────────────────────────────────────────────────────────────
        builder
            .addCase(createLog.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(createLog.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(createLog.fulfilled, (state, action) => {
                state.logLoading = false;
                const exists = state.logs.find((l) => l._id === action.payload._id);
                if (!exists) state.logs.unshift(action.payload);
            });

        // ── addFoodToLog ──────────────────────────────────────────────────────────
        builder
            .addCase(addFoodToLog.pending, pending)
            .addCase(addFoodToLog.rejected, rejected)
            .addCase(addFoodToLog.fulfilled, (state, action) => {
                state.loading = false;
                const { logId, meal, item } = action.payload;
                // update logs array
                state.logs = state.logs.map((log) => {
                    if (log._id !== logId) return log;
                    return { ...log, [meal]: [...(log[meal] || []), item] };
                });
                // update todayLog if it matches
                if (state.todayLog?._id === logId) {
                    state.todayLog[meal] = [...(state.todayLog[meal] || []), item];
                }
                // update selectedLog if it matches
                if (state.selectedLog?._id === logId) {
                    state.selectedLog[meal] = [...(state.selectedLog[meal] || []), item];
                }
            });

        // ── updateFoodInLog ───────────────────────────────────────────────────────
        builder
            .addCase(updateFoodInLog.pending, pending)
            .addCase(updateFoodInLog.rejected, rejected)
            .addCase(updateFoodInLog.fulfilled, (state, action) => {
                state.loading = false;
                const { logId, meal, item } = action.payload;
                state.logs = replaceFoodInLog(state.logs, logId, meal, item);
                if (state.todayLog?._id === logId)
                    state.todayLog = replaceFoodInLog([state.todayLog], logId, meal, item)[0];
                if (state.selectedLog?._id === logId)
                    state.selectedLog = replaceFoodInLog([state.selectedLog], logId, meal, item)[0];
            });

        // ── deleteFoodFromLog ─────────────────────────────────────────────────────
        builder
            .addCase(deleteFoodFromLog.pending, pending)
            .addCase(deleteFoodFromLog.rejected, rejected)
            .addCase(deleteFoodFromLog.fulfilled, (state, action) => {
                state.loading = false;
                const { logId, meal, foodId } = action.payload;
                const removeFn = (log) => {
                    if (log._id !== logId) return log;
                    return { ...log, [meal]: log[meal].filter((f) => f._id !== foodId) };
                };
                state.logs = state.logs.map(removeFn);
                if (state.todayLog?._id === logId) state.todayLog = removeFn(state.todayLog);
                if (state.selectedLog?._id === logId) state.selectedLog = removeFn(state.selectedLog);
            });

        // ── deleteLog ─────────────────────────────────────────────────────────────
        builder
            .addCase(deleteLog.pending, (state) => { state.logLoading = true; state.error = null; })
            .addCase(deleteLog.rejected, (state, action) => { state.logLoading = false; state.error = action.payload; })
            .addCase(deleteLog.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logs = state.logs.filter((l) => l._id !== action.payload);
                if (state.todayLog?._id === action.payload) state.todayLog = null;
                if (state.selectedLog?._id === action.payload) state.selectedLog = null;
            });
    },
});

export const { clearError, clearSelectedLog } = nutritionSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────────────────────

// Current-day
// Safe fallback so selectors never crash before fetchNutrition resolves
const EMPTY_NUTRITION = { breakfast: [], lunch: [], dinner: [], snacks: [] };

export const selectNutrition = (state) => state.nutrition.nutrition ?? EMPTY_NUTRITION;
export const selectMeal = (meal) => (state) => (state.nutrition.nutrition ?? EMPTY_NUTRITION)[meal] ?? [];
export const selectSummary = (state) => state.nutrition.summary;
export const selectNutritionLoading = (state) => state.nutrition.loading;
export const selectNutritionError = (state) => state.nutrition.error;

// Memoized with createSelector — only recomputes when the nutrition object
// actually changes, eliminating the "different reference" rerender warning.
export const selectTodayTotals = createSelector(
    selectNutrition,
    (nutrition) => {
        const breakfast = nutrition.breakfast ?? [];
        const lunch = nutrition.lunch ?? [];
        const dinner = nutrition.dinner ?? [];
        const snacks = nutrition.snacks ?? [];
        const all = [...breakfast, ...lunch, ...dinner, ...snacks];
        return {
            calories: all.reduce((s, i) => s + (i.calories || 0), 0),
            protein: all.reduce((s, i) => s + (i.protein || 0), 0),
            carbs: all.reduce((s, i) => s + (i.carbs || 0), 0),
            fats: all.reduce((s, i) => s + (i.fats || 0), 0),
        };
    }
);

// Logs
export const selectAllLogs = (state) => state.nutrition.logs;
export const selectTodayLog = (state) => state.nutrition.todayLog;
export const selectSelectedLog = (state) => state.nutrition.selectedLog;
export const selectLogsSummary = (state) => state.nutrition.logsSummary;
export const selectLogLoading = (state) => state.nutrition.logLoading;

export default nutritionSlice.reducer;