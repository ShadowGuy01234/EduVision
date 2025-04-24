import { motion } from 'framer-motion';

const RealtimeBadge = () => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-2 h-2 bg-green-500 rounded-full"
      />
      <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
    </div>
  );
};

export default RealtimeBadge; 