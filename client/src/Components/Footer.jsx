import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaSchool, 
  FaChalkboardTeacher, 
  FaBookOpen, 
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      y: -3,
      color: '#4f46e5', // indigo-600
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaSchool className="text-indigo-500 text-3xl" />
              <h3 className="text-2xl font-bold text-white">EducationForAll</h3>
            </div>
            <p className="text-gray-400">
              Empowering educators with intuitive tools to manage classrooms, track student progress, and enhance learning experiences.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#4f46e5' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#4f46e5' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#4f46e5' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3, color: '#4f46e5' }}
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-indigo-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Home
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Students
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Teachers
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Classes
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Reports
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaBookOpen className="text-indigo-500" />
              Resources
            </h3>
            <ul className="space-y-3">
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Documentation
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Tutorials
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Blog
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Webinars
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  <FaArrowRight className="text-xs" />
                  Support
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaChalkboardTeacher className="text-indigo-500" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-indigo-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Education St, Learning City, LC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-indigo-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-500" />
                <span className="text-gray-400">support@edumanage.com</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} EduManage. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-500 hover:text-indigo-500 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 text-sm">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;