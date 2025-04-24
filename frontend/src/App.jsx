import { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import Sidebar from './components/shared/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import SessionDetail from './pages/SessionDetail';
import Settings from './pages/Settings';
import StudentProfile from './pages/StudentProfile';
import ClassroomLogs from './pages/ClassroomLogs';
import LogDetail from './pages/LogDetail';
import './App.css';

// Create auth context
export const AuthContext = createContext();

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200`}>
        {user && <Sidebar theme={theme} toggleTheme={toggleTheme} />}
        <main className={`py-6 px-4 sm:px-6 md:px-8 ${user ? 'ml-0 md:ml-64' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                user ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/history"
              element={
                user ? <History /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/history/:id"
              element={
                user ? <SessionDetail /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/settings"
              element={
                user ? <Settings /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/student/:id"
              element={
                user ? <StudentProfile /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/logs"
              element={
                user ? <ClassroomLogs /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/logs/:filename"
              element={
                user ? <LogDetail /> : <Navigate to="/login" replace />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
