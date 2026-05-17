import { useSelector, useDispatch } from 'react-redux';
import { executeLogin, logoutUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    const result = await dispatch(executeLogin(credentials));
    if (executeLogin.fulfilled.match(result)) {
      navigate('/dashboard');
      return { success: true };
    }
    return { success: false, error: result.payload };
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    isManager: user?.role === 'Manager',
    isEmployee: user?.role === 'Employee',
    login,
    logout
  };
};