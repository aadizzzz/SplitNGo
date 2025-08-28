import { motion } from 'framer-motion';

const Pricing = () => {
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
        Pricing Plans
      </motion.h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center"
        >
          SplitNGo is currently in beta and free for all users.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-muted-foreground mb-8"
        >
          Our upcoming pricing plans:
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8"
        >
          <div className="bg-card border rounded-lg p-4 sm:p-6 text-center hover-scale glass-card">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Free</h3>
            <p className="text-2xl sm:text-3xl font-bold gradient-text mb-4">₹0</p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Direct & Split Journeys</li>
              <li>• Real-time Search</li>
            </ul>
          </div>
          
          <div className="bg-card border-2 border-primary rounded-lg p-4 sm:p-6 text-center relative hover-scale glass-card">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs sm:text-sm">
              Popular
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Pro</h3>
            <p className="text-2xl sm:text-3xl font-bold gradient-text mb-4">₹49<span className="text-sm text-muted-foreground">/month</span></p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• Multi-train Layovers</li>
              <li>• Smart Preferences</li>
              <li>• Priority Support</li>
            </ul>
          </div>
          
          <div className="bg-card border rounded-lg p-4 sm:p-6 text-center hover-scale glass-card">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-2xl sm:text-3xl font-bold gradient-text mb-4">Custom</p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li>• API Access</li>
              <li>• Dashboard</li>
              <li>• Data Insights</li>
            </ul>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Early users will get lifetime discounts on premium plans.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Pricing;