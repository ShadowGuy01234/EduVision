import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={`${isCollapsed ? 'w-16' : 'w-64'} top-0 sticky h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold text-gray-800 dark:text-white ${isCollapsed ? 'hidden' : ''}`}>
            EduVision
          </h1>
        </div>

        <div className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-4 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg transition-colors`}
            title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5" />
                {!isCollapsed && <span>Light Mode</span>}
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-4 py-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-lg transition-colors mt-2`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 