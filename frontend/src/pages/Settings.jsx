import { useState } from 'react';
import { Moon, Sun, Bell, Clock, Users, BarChart2, Save } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [thresholds, setThresholds] = useState({
    disengagementThreshold: 60,
    warningThreshold: 75,
    engagementThreshold: 85,
  });
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [autoExport, setAutoExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleNotificationsChange = () => {
    setNotifications(!notifications);
  };

  const handleDarkModeChange = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThresholdChange = (key, value) => {
    setThresholds({
      ...thresholds,
      [key]: parseInt(value),
    });
  };

  const handleSave = () => {
    // In a real application, this would save settings to a backend
    console.log('Saving settings:', {
      darkMode,
      notifications,
      thresholds,
      refreshInterval,
      autoExport,
      exportFormat,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Application Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive alerts for student activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={handleNotificationsChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark theme
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Thresholds</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Disengagement Threshold (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.disengagementThreshold}
              onChange={(e) => handleThresholdChange('disengagementThreshold', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              {thresholds.disengagementThreshold}%
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Warning Threshold (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.warningThreshold}
              onChange={(e) => handleThresholdChange('warningThreshold', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              {thresholds.warningThreshold}%
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Engagement Threshold (%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={thresholds.engagementThreshold}
              onChange={(e) => handleThresholdChange('engagementThreshold', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              {thresholds.engagementThreshold}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Data & Export</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Refresh Interval (seconds)
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Save className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Auto-export Reports</span>
            </div>
            <button
              onClick={() => setAutoExport(!autoExport)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                autoExport ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  autoExport ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 