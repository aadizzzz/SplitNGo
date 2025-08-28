import React from 'react';
import { motion } from 'framer-motion';
import { Train } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <motion.div
          animate={{
            x: [0, 100, 0],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <Train className="w-16 h-16 text-primary mx-auto" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2">Finding Best Routes</h3>
          <div className="flex justify-center space-x-1 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          <p className="text-muted-foreground">Analyzing train schedules and routes...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;