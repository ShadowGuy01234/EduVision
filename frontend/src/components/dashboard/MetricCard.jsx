import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {trend && (
        <div className={`flex items-center mt-4 text-sm ${getTrendColor(trend)}`}>
          <span className="font-medium">{trendValue}</span>
          <span className="ml-1">vs last session</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard; 