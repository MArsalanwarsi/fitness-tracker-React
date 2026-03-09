import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../../api/api";

const BASE = "/dashboard";

const authHeader = () => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No token found");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchDashboard = createAsyncThunk(
    "dashboard/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(BASE, authHeader());
            return data.dashboard;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const updateGoals = createAsyncThunk(
    "dashboard/updateGoals",
    async (goals, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE}/goals`, goals, authHeader());
            return data.goals;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const updateMood = createAsyncThunk(
    "dashboard/updateMood",
    async (mood, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE}/mood`, { mood }, authHeader());
            return data.mood;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const updateBmi = createAsyncThunk(
    "dashboard/updateBmi",
    async (bmi, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE}/bmi`, bmi, authHeader());
            return data.bmi;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const updateWaterGlasses = createAsyncThunk(
    "dashboard/updateWaterGlasses",
    async (count, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`${BASE}/water-glasses`, { count }, authHeader());
            return data.waterGlasses;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const logActivity = createAsyncThunk(
    "dashboard/logActivity",
    async ({ type, value, note = "", caloriesOverride }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${BASE}/log`, { type, value, note, caloriesOverride }, authHeader());
            return data;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const deleteActivityLog = createAsyncThunk(
    "dashboard/deleteActivityLog",
    async (logId, { rejectWithValue }) => {
        try {
            await api.delete(`${BASE}/log/${logId}`, authHeader());
            return logId;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const deleteWorkout = createAsyncThunk(
    "dashboard/deleteWorkout",
    async (workoutId, { rejectWithValue }) => {
        try {
            await api.delete(`${BASE}/workouts/${workoutId}`, authHeader());
            return workoutId;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

export const resetTodayStats = createAsyncThunk(
    "dashboard/resetTodayStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`${BASE}/reset-today`, {}, authHeader());
            return data;
        } catch (err) {
            return rejectWithValue(err.message || err.response?.data?.error);
        }
    }
);

const EMPTY_WEEKLY = [0, 0, 0, 0, 0, 0, 0];

const initialState = {

    name: "",
    profile_pic: null,


    goals: {
        water: 3,
        calories: 2500,
        steps: 10000,
        sleep: 8,
        protein: 150,
        carbs: 280,
        fat: 80,
    },


    weeklyStats: {
        water: [...EMPTY_WEEKLY],
        calories: [...EMPTY_WEEKLY],
        steps: [...EMPTY_WEEKLY],
        sleep: [...EMPTY_WEEKLY],
        weight: [...EMPTY_WEEKLY],
    },


    macros: { protein: 0, carbs: 0, fat: 0 },


    bmi: { height: 170, weight: 70 },


    waterGlasses: 0,
    mood: "good",


    streak: { week: [0, 0, 0, 0, 0, 0, "today"], count: 0 },


    activityLogs: [],
    workouts: [],


    todayIndex: (new Date().getDay() + 6) % 7,


    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,

    reducers: {
        clearDashboardError: (state) => { state.error = null; },


        setWaterGlassesLocal: (state, action) => {
            state.waterGlasses = action.payload;
        },


        setMoodLocal: (state, action) => {
            state.mood = action.payload;
        },
    },

    extraReducers: (builder) => {


        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, { payload }) => {
                state.loading = false;
                if (!payload) return;
                if (payload.name !== undefined) state.name = payload.name;
                if (payload.profile_pic !== undefined) state.profile_pic = payload.profile_pic;
                if (payload.goals !== undefined) state.goals = payload.goals;
                if (payload.weeklyStats !== undefined) state.weeklyStats = payload.weeklyStats;
                if (payload.macros !== undefined) state.macros = payload.macros;
                if (payload.bmi !== undefined) state.bmi = payload.bmi;
                if (payload.waterGlasses !== undefined) state.waterGlasses = payload.waterGlasses;
                if (payload.mood !== undefined) state.mood = payload.mood;
                if (payload.streak !== undefined) state.streak = payload.streak;
                if (payload.activityLogs !== undefined) state.activityLogs = payload.activityLogs;
                if (payload.workouts !== undefined) state.workouts = payload.workouts;
                if (payload.todayIndex !== undefined) state.todayIndex = payload.todayIndex;
            })
            .addCase(fetchDashboard.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });


        builder
            .addCase(updateGoals.fulfilled, (state, { payload }) => {
                state.goals = payload;
            })
            .addCase(updateGoals.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(updateMood.fulfilled, (state, { payload }) => {
                state.mood = payload;
            })
            .addCase(updateMood.rejected, (state, { payload }) => {
                state.error = payload;

            });


        builder
            .addCase(updateBmi.fulfilled, (state, { payload }) => {
                state.bmi = payload;
            })
            .addCase(updateBmi.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(updateWaterGlasses.fulfilled, (state, { payload }) => {
                state.waterGlasses = payload;
            })
            .addCase(updateWaterGlasses.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(logActivity.fulfilled, (state, { payload }) => {

                if (payload.log) state.activityLogs = [payload.log, ...state.activityLogs].slice(0, 50);
                if (payload.weeklyStats) state.weeklyStats = payload.weeklyStats;
                if (payload.macros) state.macros = payload.macros;
                if (payload.waterGlasses !== undefined) state.waterGlasses = payload.waterGlasses;
                if (payload.workouts) state.workouts = payload.workouts;
            })
            .addCase(logActivity.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(deleteActivityLog.fulfilled, (state, { payload: logId }) => {
                state.activityLogs = state.activityLogs.filter((l) => l._id !== logId);
            })
            .addCase(deleteActivityLog.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(deleteWorkout.fulfilled, (state, { payload: workoutId }) => {
                state.workouts = state.workouts.filter((w) => w._id !== workoutId);
            })
            .addCase(deleteWorkout.rejected, (state, { payload }) => {
                state.error = payload;
            });


        builder
            .addCase(resetTodayStats.fulfilled, (state, { payload }) => {
                if (payload.weeklyStats) state.weeklyStats = payload.weeklyStats;
                if (payload.macros) state.macros = payload.macros;
                if (payload.waterGlasses !== undefined) state.waterGlasses = payload.waterGlasses;
                if (payload.streak) state.streak = payload.streak;
                if (payload.todayIndex !== undefined) state.todayIndex = payload.todayIndex;
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

export const selectTodayIndex = (state) => state.dashboard.todayIndex;

export const selectTodayStats = createSelector(
    selectWeeklyStats,
    selectTodayIndex,
    (weekly, i) => ({
        water: weekly.water[i] ?? 0,
        calories: weekly.calories[i] ?? 0,
        steps: weekly.steps[i] ?? 0,
        sleep: weekly.sleep[i] ?? 0,
        weight: weekly.weight[i] ?? 0,
    })
);

export const selectBmiValue = createSelector(
    selectBmi,
    ({ height, weight }) =>
        height > 0 ? +(weight / ((height / 100) ** 2)).toFixed(1) : null
);

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

export const selectCaloriesLeft = createSelector(
    selectTodayStats,
    selectGoals,
    (today, goals) => Math.max(0, goals.calories - today.calories)
);

export const selectWeightDelta = createSelector(
    selectWeeklyStats,
    (weekly) => {
        const w = weekly.weight;
        const first = w.find((v) => v > 0) ?? 0;
        const last = w[6] ?? 0;
        return first > 0 ? +(last - first).toFixed(1) : 0;
    }
);

export const selectTotalWorkoutCalories = createSelector(
    selectWorkouts,
    (workouts) => workouts.reduce((s, w) => s + (w.calories || 0), 0)
);

export const selectTotalWorkoutMinutes = createSelector(
    selectWorkouts,
    (workouts) => workouts.reduce((s, w) => s + (w.duration || 0), 0)
);

export default dashboardSlice.reducer;