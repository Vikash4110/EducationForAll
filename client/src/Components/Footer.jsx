import { motion } from "framer-motion";
import React from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaChalkboardTeacher,
  FaEnvelope,
  FaFacebook,
  FaGraduationCap,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../assets/EFAS_Logo.webp";
const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      y: -3,
      color: "#7d9b76", // green
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <footer className="bg-[#272727] text-[#f6f6e9] pt-16 pb-8">
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
            <motion.div className="flex items-center space-x-2">
              <Link
                to="/"
                className="flex items-center space-x-2 group"
                aria-label="Home"
              >
                <div className="p-1.5 rounded-lg transition-colors duration-300 shadow-md">
                  <img
                    src={Logo}
                    alt="EFAS Logo"
                    className="h-16 w-16 sm:h-16 sm:w-16 object-contain"
                  />
                </div>
              </Link>
            </motion.div>
            <p className="text-[#f6f6e9]/80">
              Empowering educators with intuitive tools to manage classrooms,
              track student progress, and enhance learning experiences.
            </p>
            <div className="flex space-x-4 pt-2">
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#7d9b76" }}
                className="text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#7d9b76" }}
                className="text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#7d9b76" }}
                className="text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3, color: "#7d9b76" }}
                className="text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-[#f6f6e9] mb-6 flex items-center gap-2">
              <FaGraduationCap className="text-[#7d9b76]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Home
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Students
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Teachers
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Classes
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Reports
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold text-[#f6f6e9] mb-6 flex items-center gap-2">
              <FaBookOpen className="text-[#7d9b76]" />
              Resources
            </h3>
            <ul className="space-y-3">
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Documentation
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Tutorials
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Blog
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Webinars
                </a>
              </motion.li>
              <motion.li variants={linkVariants} whileHover="hover">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#f6f6e9]/80 hover:text-[#7d9b76] transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                  Support
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-[#f6f6e9] mb-6 flex items-center gap-2">
              <FaChalkboardTeacher className="text-[#7d9b76]" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#7d9b76] mt-1 flex-shrink-0" />
                <span className="text-[#f6f6e9]/80">
                  123 Education St, Learning City, LC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#7d9b76]" />
                <span className="text-[#f6f6e9]/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#7d9b76]" />
                <span className="text-[#f6f6e9]/80">support@edumanage.com</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-[#f6f6e9]/20 pt-8 text-center">
          <p className="text-[#f6f6e9]/60">
            &copy; {new Date().getFullYear()} EduManage. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="#"
              className="text-[#f6f6e9]/60 hover:text-[#7d9b76] text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[#f6f6e9]/60 hover:text-[#7d9b76] text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-[#f6f6e9]/60 hover:text-[#7d9b76] text-sm"
            >
              Cookies Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
