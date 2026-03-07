import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import api from "../../api/api";
import Cookies from 'js-cookie';
const BASE = "/dashboard";

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC THUNKS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/dashboard — fetch everything in one call */
export const fetchDashboard = createAsyncThunk(
    "dashboard/fetchDashboard",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.get(BASE, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            return data.dashboard;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** PUT /api/dashboard/goals — body: { water, calories, steps, sleep, protein, carbs, fat } */
export const updateGoals = createAsyncThunk(
    "dashboard/updateGoals",
    async (goals, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/goals`, goals, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.goals;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** PUT /api/dashboard/mood — body: { mood: "bad"|"ok"|"good" } */
export const updateMood = createAsyncThunk(
    "dashboard/updateMood",
    async (mood, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/mood`, { mood }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.mood;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** PUT /api/dashboard/bmi — body: { height?, weight? } */
export const updateBmi = createAsyncThunk(
    "dashboard/updateBmi",
    async (bmi, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/bmi`, bmi, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.bmi;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** PUT /api/dashboard/water-glasses — body: { count: 0-8 } */
export const updateWaterGlasses = createAsyncThunk(
    "dashboard/updateWaterGlasses",
    async (count, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.put(`${BASE}/water-glasses`, { count }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.waterGlasses;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** POST /api/dashboard/log — body: { type, value, note?, caloriesOverride? } */
export const logActivity = createAsyncThunk(
    "dashboard/logActivity",
    async ({ type, value, note = "", caloriesOverride }, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.post(`${BASE}/log`, { type, value, note, caloriesOverride }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data; // { log, weeklyStats, macros, waterGlasses, workouts }
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** DELETE /api/dashboard/log/:logId */
export const deleteActivityLog = createAsyncThunk(
    "dashboard/deleteActivityLog",
    async (logId, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/log/${logId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return logId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** DELETE /api/dashboard/workouts/:workoutId */
export const deleteWorkout = createAsyncThunk(
    "dashboard/deleteWorkout",
    async (workoutId, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            await api.delete(`${BASE}/workouts/${workoutId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return workoutId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

/** POST /api/dashboard/reset-today */
export const resetTodayStats = createAsyncThunk(
    "dashboard/resetTodayStats",
    async (_, { rejectWithValue }) => {
        const token = Cookies.get('auth_token');
        if (!token) {
            return rejectWithValue("No token found");
        }
        try {
            const { data } = await api.post(`${BASE}/reset-today`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data; // { weeklyStats, macros, waterGlasses, streak }
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_WEEKLY = [0, 0, 0, 0, 0, 0, 0];

const initialState = {
    // Profile
    name: "",
    profile_pic: null,

    // Goals
    goals: {
        water: 3,
        calories: 2500,
        steps: 10000,
        sleep: 8,
        protein: 150,
        carbs: 280,
        fat: 80,
    },

    // Weekly arrays (index 6 = today)
    weeklyStats: {
        water: [...EMPTY_WEEKLY],
        calories: [...EMPTY_WEEKLY],
        steps: [...EMPTY_WEEKLY],
        sleep: [...EMPTY_WEEKLY],
        weight: [...EMPTY_WEEKLY],
    },

    // Today's macros
    macros: { protein: 0, carbs: 0, fat: 0 },

    // Body stats
    bmi: { height: 170, weight: 70 },

    // Quick widgets
    waterGlasses: 0,
    mood: "good",

    // Streak
    streak: { week: [0, 0, 0, 0, 0, 0, "today"], count: 0 },

    // Lists
    activityLogs: [],
    workouts: [],

    // UI
    loading: false,
    error: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,

    reducers: {
        clearDashboardError: (state) => { state.error = null; },

        // Optimistic water glass toggle (instant UI, confirmed by thunk)
        setWaterGlassesLocal: (state, action) => {
            state.waterGlasses = action.payload;
        },

        // Optimistic mood toggle
        setMoodLocal: (state, action) => {
            state.mood = action.payload;
        },
    },

    extraReducers: (builder) => {

        // ── fetchDashboard ───────────────────────────────────────────────────────
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.name = payload.name ?? state.name;
                state.profile_pic = payload.profile_pic ?? state.profile_pic;
                state.goals = payload.goals ?? state.goals;
                state.weeklyStats = payload.weeklyStats ?? state.weeklyStats;
                state.macros = payload.macros ?? state.macros;
                state.bmi = payload.bmi ?? state.bmi;
                state.waterGlasses = payload.waterGlasses ?? state.waterGlasses;
                state.mood = payload.mood ?? state.mood;
                state.streak = payload.streak ?? state.streak;
                state.activityLogs = payload.activityLogs ?? state.activityLogs;
                state.workouts = payload.workouts ?? state.workouts;
            })
            .addCase(fetchDashboard.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });

        // ── updateGoals ──────────────────────────────────────────────────────────
        builder
            .addCase(updateGoals.fulfilled, (state, { payload }) => {
                state.goals = payload;
            })
            .addCase(updateGoals.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── updateMood ───────────────────────────────────────────────────────────
        builder
            .addCase(updateMood.fulfilled, (state, { payload }) => {
                state.mood = payload;
            })
            .addCase(updateMood.rejected, (state, { payload }) => {
                state.error = payload;
                // mood already set optimistically — could revert here if needed
            });

        // ── updateBmi ────────────────────────────────────────────────────────────
        builder
            .addCase(updateBmi.fulfilled, (state, { payload }) => {
                state.bmi = payload;
            })
            .addCase(updateBmi.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── updateWaterGlasses ───────────────────────────────────────────────────
        builder
            .addCase(updateWaterGlasses.fulfilled, (state, { payload }) => {
                state.waterGlasses = payload;
            })
            .addCase(updateWaterGlasses.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── logActivity ──────────────────────────────────────────────────────────
        builder
            .addCase(logActivity.fulfilled, (state, { payload }) => {
                // Backend returns all affected fields in one response
                if (payload.log) state.activityLogs = [payload.log, ...state.activityLogs].slice(0, 50);
                if (payload.weeklyStats) state.weeklyStats = payload.weeklyStats;
                if (payload.macros) state.macros = payload.macros;
                if (payload.waterGlasses !== undefined) state.waterGlasses = payload.waterGlasses;
                if (payload.workouts) state.workouts = payload.workouts;
            })
            .addCase(logActivity.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── deleteActivityLog ────────────────────────────────────────────────────
        builder
            .addCase(deleteActivityLog.fulfilled, (state, { payload: logId }) => {
                state.activityLogs = state.activityLogs.filter((l) => l._id !== logId);
            })
            .addCase(deleteActivityLog.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── deleteWorkout ────────────────────────────────────────────────────────
        builder
            .addCase(deleteWorkout.fulfilled, (state, { payload: workoutId }) => {
                state.workouts = state.workouts.filter((w) => w._id !== workoutId);
            })
            .addCase(deleteWorkout.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // ── resetTodayStats ──────────────────────────────────────────────────────
        builder
            .addCase(resetTodayStats.fulfilled, (state, { payload }) => {
                if (payload.weeklyStats) state.weeklyStats = payload.weeklyStats;
                if (payload.macros) state.macros = payload.macros;
                if (payload.waterGlasses !== undefined) state.waterGlasses = payload.waterGlasses;
                if (payload.streak) state.streak = payload.streak;
            })
            .addCase(resetTodayStats.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const {
    clearDashboardError,
    setWaterGlassesLocal,
    setMoodLocal,
} = dashboardSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────────────────────

const selectDashboard = (state) => state.dashboard;

export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectUserName = (state) => state.dashboard.name;
export const selectProfilePic = (state) => state.dashboard.profile_pic;
export const selectGoals = (state) => state.dashboard.goals;
export const selectWeeklyStats = (state) => state.dashboard.weeklyStats;
export const selectMacros = (state) => state.dashboard.macros;
export const selectBmi = (state) => state.dashboard.bmi;
export const selectWaterGlasses = (state) => state.dashboard.waterGlasses;
export const selectMood = (state) => state.dashboard.mood;
export const selectStreak = (state) => state.dashboard.streak;
export const selectActivityLogs = (state) => state.dashboard.activityLogs;
export const selectWorkouts = (state) => state.dashboard.workouts;

/** Today's values (index 6 of each weekly array) — memoized */
export const selectTodayStats = createSelector(
    selectWeeklyStats,
    (weekly) => ({
        water: weekly.water[6] ?? 0,
        calories: weekly.calories[6] ?? 0,
        steps: weekly.steps[6] ?? 0,
        sleep: weekly.sleep[6] ?? 0,
        weight: weekly.weight[6] ?? 0,
    })
);

/** Computed BMI value — memoized */
export const selectBmiValue = createSelector(
    selectBmi,
    ({ height, weight }) =>
        height > 0 ? +(weight / ((height / 100) ** 2)).toFixed(1) : null
);

/** Overall daily goal % — memoized */
export const selectOverallPct = createSelector(
    selectTodayStats,
    selectGoals,
    (today, goals) => {
        const pct = (v, t) => Math.min(Math.round((v / t) * 100), 100);
        return Math.round(
            (pct(today.water, goals.water) +
                pct(today.calories, goals.calories) +
                pct(today.steps, goals.steps) +
                pct(today.sleep, goals.sleep)) / 4
        );
    }
);

/** Calories remaining today — memoized */
export const selectCaloriesLeft = createSelector(
    selectTodayStats,
    selectGoals,
    (today, goals) => Math.max(0, goals.calories - today.calories)
);

/** Weight trend delta (first vs last of weekly array) — memoized */
export const selectWeightDelta = createSelector(
    selectWeeklyStats,
    (weekly) => {
        const w = weekly.weight;
        const first = w.find((v) => v > 0) ?? 0;
        const last = w[6] ?? 0;
        return first > 0 ? +(last - first).toFixed(1) : 0;
    }
);

/** Total workout calories burned — memoized */
export const selectTotalWorkoutCalories = createSelector(
    selectWorkouts,
    (workouts) => workouts.reduce((s, w) => s + (w.calories || 0), 0)
);

/** Total workout minutes — memoized */
export const selectTotalWorkoutMinutes = createSelector(
    selectWorkouts,
    (workouts) => workouts.reduce((s, w) => s + (w.duration || 0), 0)
);

export default dashboardSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER IN store.js:
// import dashboardReducer from "./slice/dashboardSlice";
// dashboard: dashboardReducer,
// ─────────────────────────────────────────────────────────────────────────────