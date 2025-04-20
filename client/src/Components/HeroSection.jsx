import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import studentHero from '../assets/vecteezy_group-of-students-watching-an-educational-webinar-in-class_55545026.png';
import { 
  FaChalkboardTeacher, 
  FaSchool, 
  FaUserGraduate,
  FaUsers,
  FaUserPlus,
  FaArrowRight,
  FaBookOpen,
  FaChartLine,
  FaUserTie
} from 'react-icons/fa';

const stats = [
  { value: '10K+', label: 'Students Managed', icon: <FaUserGraduate className="text-indigo-500 text-2xl mb-2" /> },
  { value: '500+', label: 'Active Teachers', icon: <FaChalkboardTeacher className="text-indigo-500 text-2xl mb-2" /> },
  { value: '100+', label: 'Schools Supported', icon: <FaSchool className="text-indigo-500 text-2xl mb-2" /> },
];

const StatItem = ({ item, index }) => {
  return (
    <motion.div
      className="flex flex-col items-center px-4 py-4 bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    >
      {item.icon}
      <p className="text-3xl font-bold text-indigo-600 mb-1">{item.value}</p>
      <p className="text-sm font-medium text-gray-500">{item.label}</p>
    </motion.div>
  );
};

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.2, 0.65, 0.3, 0.9] 
      } 
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.2, 0.65, 0.3, 0.9] 
      } 
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      } 
    },
    tap: { 
      scale: 0.98,
      transition: { 
        duration: 0.1 
      } 
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Text Content */}
          <motion.div 
            className="flex-1 lg:w-1/2"
            variants={textVariants}
          >
            <div className="max-w-xl mx-auto lg:mx-0">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900"
              >
                <span className="flex items-center gap-2">
                  <FaUserTie className="text-indigo-500 text-4xl" />
                  <span>Manage Your</span>
                </span>
                <span className="relative inline-block">
                  <span className="relative z-10">Students</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-indigo-200/50 -z-1" style={{ bottom: '10%' }} />
                </span>
                <span className="flex items-center gap-2 text-indigo-600">
                  <FaChartLine className="text-indigo-500" />
                  <span>with Ease</span>
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed flex items-start gap-2"
                variants={textVariants}
              >
                <FaBookOpen className="text-indigo-400 mt-1 flex-shrink-0" />
                <span>Simplify classroom management with our intuitive platform designed for teachers to organize, track, and support their students effectively.</span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                variants={textVariants}
              >
                <motion.div variants={buttonVariants}>
                  <Link
                    to="/teacher-register"
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                  >
                    <FaUsers className="text-lg" />
                   Register as Teacher
                    <FaArrowRight className="text-sm" />
                  </Link>
                </motion.div>
                
                <motion.div variants={buttonVariants}>
                  <Link
                    to="/student-login"
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <FaUserPlus className="text-lg" />
                    Login as Student
                    <FaArrowRight className="text-sm" />
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-3 gap-4 max-w-md"
                variants={textVariants}
              >
                {stats.map((item, index) => (
                  <StatItem key={index} item={item} index={index} />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            className="flex-1 lg:w-1/2 relative"
            variants={imageVariants}
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="relative z-10 rounded-xl overflow-hidden">
                <img
                  src={studentHero}
                  className="w-full h-auto object-cover"
                  alt="Teacher managing students in classroom"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-100 rounded-full opacity-20 blur-xl" />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-indigo-200 rounded-full opacity-10 blur-xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;