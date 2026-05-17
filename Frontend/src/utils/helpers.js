import { format } from 'date-fns';

/**
 * Goal weightage total calculate karne ke liye
 */
export const calculateTotalWeightage = (goals = []) => {
  return goals.reduce((acc, goal) => acc + (Number(goal.weightage) || 0), 0);
};

/**
 * Enterprise Date Formatting (e.g., 14 May 2026)
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy');
};

/**
 * Text truncation for long goal descriptions
 */
export const truncateText = (text, length = 100) => {
  if (text?.length <= length) return text;
  return text?.substring(0, length) + '...';
};

/**
 * Role-based link filter for Sidebar
 */
export const filterRoutesByRole = (routes, userRole) => {
  return routes.filter(route => route.roles.includes(userRole));
};