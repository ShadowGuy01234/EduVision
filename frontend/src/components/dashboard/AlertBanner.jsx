import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertBanner = ({ disengagedCount, threshold = 3 }) => {
  const showAlert = disengagedCount >= threshold;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                High Disengagement Alert
              </h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                {disengagedCount} students are currently disengaged. Consider taking action to improve engagement.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner; 