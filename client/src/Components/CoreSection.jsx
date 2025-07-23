import { motion } from "framer-motion";
import React from "react";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaLightbulb,
  FaSchool,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const AboutCards = () => {
  const cards = [
    {
      title: "The Problem: Why the Modern Education System Needs a Reset",
      link: "/problem",
      icon: <FaSchool className="text-3xl mb-4 text-[#7d9b76]" />,
    },
    {
      title: "Why Change in Education Feels Impossible, But Isn't",
      link: "/change",
      icon: <FaLightbulb className="text-3xl mb-4 text-[#7d9b76]" />,
    },
    {
      title: "Our Vision: Change Starts in One Classroom",
      link: "/our-vision",
      icon: <FaChalkboardTeacher className="text-3xl mb-4 text-[#7d9b76]" />,
    },
    {
      title: "Our Classroom Model: 4-Pillar Foundation",
      link: "/model",
      icon: <FaGraduationCap className="text-3xl mb-4 text-[#7d9b76]" />,
    },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f6e9]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-[#272727] mb-16 relative"
        >
          <span className="relative inline-block pb-1">
            About Education For All Society
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#7d9b76] scale-x-75"></span>
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-xl overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-8 flex-1 bg-[#272727] flex flex-col items-center text-center">
                <div className="icon-container mb-6 p-3 rounded-full bg-[#f6f6e9]/10 group-hover:bg-[#7d9b76]/20 transition-all duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-6 text-[#f6f6e9] leading-tight">
                  {card.title}
                </h3>
                <div className="mt-auto w-full">
                  <Link
                    to={card.link}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#7d9b76] hover:bg-[#7d9b76]/90 text-[#272727] font-medium transition-all duration-300 w-full group-hover:shadow-md"
                  >
                    <span>Read More</span>
                    <IoIosArrowForward className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutCards;
