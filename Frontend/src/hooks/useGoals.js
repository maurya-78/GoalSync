import { useSelector, useDispatch } from 'react-redux';
import { fetchMyGoals } from '../redux/slices/goalSlice';
import { useState, useEffect } from 'react';

export const useGoals = () => {
  const dispatch = useDispatch();
  const { items, totalWeightage, status } = useSelector((state) => state.goals);
  
  // Local state for UI calculations (like unsaved weightage)
  const [currentWeight, setCurrentWeight] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMyGoals());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setCurrentWeight(totalWeightage);
  }, [totalWeightage]);

  const validateWeightage = (newWeight) => {
    return newWeight === 100;
  };

  return {
    goals: items,
    loading: status === 'loading',
    totalWeightage: currentWeight,
    isValid: validateWeightage(currentWeight),
    refreshGoals: () => dispatch(fetchMyGoals())
  };
};