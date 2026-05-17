import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../../services/goalService';

/**
 * GOAL STRATEGY SLICE
 * -------------------
 * Manages the global state for strategic targets, quarterly telemetry,
 * and the cumulative weightage of the operational matrix.
 */

// 1. Fetch current cycle sheet and goals (Merged with your fetchMyGoals logic)
export const fetchGoals = createAsyncThunk(
  'goals/fetch',
  async (cycleId, { rejectWithValue }) => {
    try {
      // Using cycleId for enterprise-level tracking
      return await goalService.getOrCreateGoalSheet(cycleId || 'current');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch goal matrix');
    }
  }
);

// 2. Add a new goal to the grid
export const createGoal = createAsyncThunk(
  'goals/create',
  async (goalData, { rejectWithValue }) => {
    try {
      return await goalService.createGoal(goalData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Goal creation failed');
    }
  }
);

// 3. Update existing goal achievement/status (Q1-Q4 telemetry)
export const updateGoalAction = createAsyncThunk(
  'goals/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await goalService.updateGoal(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update synchronization failed');
    }
  }
);

// 4. Delete goal and reclaim weightage
export const deleteGoalAction = createAsyncThunk(
  'goals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await goalService.deleteGoal(id);
      return id; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Purge request denied');
    }
  }
);

const initialState = {
  items: [],           // Goals array (Renamed from 'goals' to match your 'items')
  sheet: null,         // Parent sheet metadata
  totalWeightage: 0,   // Cumulative matrix weight
  status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isLocked: false      // Structural locking flag
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
        state.items = action.payload.goals;
        state.sheet = action.payload.sheet;
        state.isLocked = action.payload.sheet?.isLocked || false;
        // Merged your weightage calculation logic
        state.totalWeightage = action.payload.goals.reduce((sum, g) => sum + g.weightage, 0);
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // CREATE GOAL (Optimistic Update)
      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.totalWeightage += action.payload.weightage;
      })

      // UPDATE GOAL
      .addCase(updateGoalAction.fulfilled, (state, action) => {
        const index = state.items.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          // Recalculate weightage if weightage was changed
          const oldWeight = state.items[index].weightage;
          state.totalWeightage = (state.totalWeightage - oldWeight) + action.payload.weightage;
          state.items[index] = action.payload;
        }
      })

      // DELETE GOAL
      .addCase(deleteGoalAction.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const goalToRemove = state.items.find(g => g._id === deletedId);
        if (goalToRemove) {
          state.totalWeightage -= goalToRemove.weightage;
          state.items = state.items.filter(g => g._id !== deletedId);
        }
      });
  },
});

export const { resetGoalStatus } = goalSlice.actions;
export default goalSlice.reducer;