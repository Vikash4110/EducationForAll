import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaGraduationCap, FaLightbulb } from "react-icons/fa";

const Loader = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        when: "beforeChildren"
      } 
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: { 
        duration: 8, 
        repeat: Infinity, 
        ease: "linear" 
      },
    },
  };

  const iconVariants = {
    animate: (i) => ({
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        delay: i * 0.3,
        ease: "easeInOut" 
      },
    }),
  };

  const textVariants = {
    animate: {
      opacity: [0.7, 1, 0.7],
      transition: { 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut" 
      },
    },
  };

  const icons = [
    { icon: <FaBookOpen className="text-indigo-600 text-xl" />, delay: 0 },
    { icon: <FaGraduationCap className="text-blue-500 text-xl" />, delay: 0.2 },
    { icon: <FaLightbulb className="text-teal-500 text-xl" />, delay: 0.4 }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative w-40 h-40 mb-8">
        {/* Central logo */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">EFA</span>
          </div>
        </motion.div>

        {/* Orbiting icons */}
        <motion.div 
          className="absolute inset-0"
          variants={orbitVariants}
          animate="animate"
        >
          {icons.map((item, i) => (
            <motion.div
              key={i}
              className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
              style={{
                top: "0%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              custom={i}
              variants={iconVariants}
              animate="animate"
            >
              {item.icon}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Text animation */}
      <motion.div
        className="text-center"
        variants={textVariants}
        animate="animate"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          EducationForAll
        </h2>
        <motion.p 
          className="text-gray-600 mt-2"
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: { 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          Empowering minds globally
        </motion.p>
      </motion.div>

      {/* Progress indicator */}
      <motion.div 
        className="mt-8 h-1 w-40 bg-gray-200 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ 
          width: "10rem",
          transition: { 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut" 
          }
        }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-400"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Loader;