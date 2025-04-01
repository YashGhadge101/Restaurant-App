import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center gap-8 relative overflow-hidden p-4">
      {/* Animated logo/icon with floating animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { type: "spring", stiffness: 300, damping: 15 },
          opacity: { duration: 0.5 }
        }}
        className="relative"
      >
        <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-md"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <Loader2 className="w-16 h-16 text-emerald-400" strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* Loading text with pulse animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.h2 
          className="text-2xl font-semibold text-white"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Deliciousness
        </motion.h2>
        <p className="text-gray-400 text-sm max-w-md text-center">
          Preparing your culinary experience...
        </p>
      </motion.div>

      {/* Animated dots */}
      <div className="flex gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Subtle animated background elements */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/30"
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
    </div>
  );
};

export default Loading;