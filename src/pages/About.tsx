import { motion } from 'framer-motion';

const About = () => {
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
        About SplitNGo
      </motion.h1>
      <div className="prose prose-lg max-w-none text-foreground space-y-6">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          SplitNGo is a smart travel routing platform built for a future where finding the best train routes is no longer a headache. Our mission is to help commuters and travelers find optimal train journeys — whether it's a direct ride, a split seat in the same train, or a multi-train journey with intelligent layovers.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Born out of frustration with outdated booking systems, SplitNGo uses graph algorithms, real-time data, and intuitive UI to simplify complex railway journeys. Whether you're traveling across cities or planning for your family, SplitNGo gives you flexible, fast, and user-centric results.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg sm:text-xl font-semibold text-center gradient-text mt-8"
        >
          We're not just solving travel. We're reshaping how journeys are planned.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default About;