import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const stored = localStorage.getItem('gs_theme');
  if (stored && stored !== 'auto') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('gs_theme') || 'auto',
    resolvedTheme: initialTheme,
    sidebarOpen: true,
    sidebarMobileOpen: false,
  },
  reducers: {
    setTheme: (state, action) => {
      const theme = action.payload; // 'light' | 'dark' | 'auto'
      state.theme = theme;
      localStorage.setItem('gs_theme', theme);
      let resolved = theme;
      if (theme === 'auto') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      state.resolvedTheme = resolved;
      applyTheme(resolved);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen: (state, action) => { state.sidebarOpen = action.payload; },
    toggleMobileSidebar: (state) => { state.sidebarMobileOpen = !state.sidebarMobileOpen; },
    setMobileSidebar: (state, action) => { state.sidebarMobileOpen = action.payload; },
  },
});

export const { setTheme, toggleSidebar, setSidebarOpen, toggleMobileSidebar, setMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;
