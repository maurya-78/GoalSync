import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../../services/goalService';

/**
 * GOALSYNC ENTERPRISE GOAL SLICE
 * Updated with naming consistency for components
 */

// 1. FETCH GOALS + SHEET
export const fetchGoals = createAsyncThunk(
  'goals/fetch',
  async (cycleId, { rejectWithValue }) => {
    try {
      return await goalService.getOrCreateGoalSheet(cycleId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch operational goal matrix.');
    }
  }
);

// 2. CREATE GOAL
export const createGoal = createAsyncThunk(
  'goals/create',
  async (goalData, { rejectWithValue }) => {
    try {
      return await goalService.createGoal(goalData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Goal creation request failed.');
    }
  }
);

// 3. UPDATE GOAL (Renamed to match your component's request)
// Yahan humne 'updateGoalProgress' export kiya hai jo 'goals/update' action trigger karega
export const updateGoalProgress = createAsyncThunk(
  'goals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await goalService.updateGoal(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Goal synchronization failed.');
    }
  }
);

// 4. DELETE GOAL
export const deleteGoalAction = createAsyncThunk(
  'goals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await goalService.deleteGoal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Goal deletion denied.');
    }
  }
);

// 5. SUBMIT GOAL SHEET
export const submitGoalSheet = createAsyncThunk(
  'goals/submitSheet',
  async (sheetId, { rejectWithValue }) => {
    try {
      return await goalService.submitGoalSheet(sheetId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'GoalSheet submission failed.');
    }
  }
);

const initialState = {
  items: [],
  sheet: null,
  totalWeightage: 0,
  analytics: {
    completedGoals: 0,
    pendingGoals: 0,
    delayedGoals: 0,
    completionRate: 0,
    overallProgress: 0
  },
  status: 'idle',
  error: "",
  isLocked: false
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    resetGoalStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH GOALS
      .addCase(fetchGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.goals || [];
        state.sheet = action.payload.sheet || null;
        state.isLocked = action.payload.sheet?.isLocked || false;

        // Total Weightage Calculation
        state.totalWeightage = state.items.reduce((sum, goal) => sum + goal.weightage, 0);

        // Enterprise Analytics
        const completed = state.items.filter(g => g.overallProgress >= 100).length;
        const delayed = state.items.filter(g => 
          g.q1?.status === 'Delayed' || g.q2?.status === 'Delayed' || 
          g.q3?.status === 'Delayed' || g.q4?.status === 'Delayed'
        ).length;

        state.analytics.completedGoals = completed;
        state.analytics.pendingGoals = state.items.length - completed;
        state.analytics.delayedGoals = delayed;
        state.analytics.completionRate = state.items.length 
          ? Math.round((completed / state.items.length) * 100) : 0;
        
        state.analytics.overallProgress = state.items.length
          ? Math.round(state.items.reduce((sum, goal) => sum + goal.overallProgress, 0) / state.items.length) : 0;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // CREATE GOAL
      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.totalWeightage += action.payload.weightage;
      })

      // UPDATE GOAL (Mapped to updateGoalProgress)
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const index = state.items.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          const oldWeight = state.items[index].weightage;
          state.totalWeightage = (state.totalWeightage - oldWeight) + action.payload.weightage;
          state.items[index] = action.payload;
        }
      })

      // DELETE GOAL
      .addCase(deleteGoalAction.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const removedGoal = state.items.find(g => g._id === deletedId);
        if (removedGoal) {
          state.totalWeightage -= removedGoal.weightage;
        }
        state.items = state.items.filter(g => g._id !== deletedId);
      })
      // SUBMIT GOAL SHEET
      .addCase(submitGoalSheet.fulfilled, (state) => {
        state.isLocked = true;
      });
  }
});

export const { resetGoalStatus } = goalSlice.actions;
export default goalSlice.reducer;