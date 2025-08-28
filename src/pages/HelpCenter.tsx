import { motion } from 'framer-motion';

const HelpCenter = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pt-24 sm:pt-32"
    >
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-6 gradient-text"
      >
        Help Center – FAQs
      </motion.h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6 sm:space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card border rounded-lg p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3">Q: How does the split journey algorithm work?</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            A: We apply BFS/A* graph search on train route maps to find alternate ways to reach your destination via seat splits or layovers.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-card border rounded-lg p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3">Q: Is my payment information secure?</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            A: Absolutely. We use encrypted gateways and don't store your payment credentials.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card border rounded-lg p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3">Q: Can I cancel split-journey tickets?</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            A: Yes, each leg of your journey can be canceled individually, based on IRCTC policy.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="glass-card border rounded-lg p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3">Q: Do you support international routes?</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            A: Not yet — but it's on our roadmap.
          </p>
        </motion.div>
        
      </div>
    </motion.div>
  );
};

export default HelpCenter;