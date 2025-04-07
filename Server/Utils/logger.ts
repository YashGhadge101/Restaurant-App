// utils/logger.ts
const logger = {
    error: (message: string, details?: any) => {
      console.error(message, details);
    },
    info: (message: string, details?: any) => {
      console.log(message, details);
    },
    // Add more logging methods as needed (warn, debug, etc.)
  };
  
  export default logger;