import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const CoreSection = () => {
  const cards = [
    {
      title: "The Problem: Why the Modern Education System Needs a Reset",
      highlights: [
        "Outdated industrial-age design",
        "Competition over collaboration",
        "Test-centric learning approach",
        "Suppression of identity",
        "Neglected life skills",
      ],
      link: "/problem",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Why Change in Education Feels Impossible, But Isn't",
      highlights: [
        "Systemic paralysis in education",
        "Lack of real demand for change",
        "Educators willing but uncertain",
        "Fear of rejection from norms",
      ],
      link: "/change",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Our Vision: Change Starts in One Classroom",
      highlights: [
        "Ground-up transformation",
        "The Grade 2 Lab: Build, Test, Refine",
        "From classroom to community",
        "A scalable revolution",
      ],
      link: "/vision",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Our Classroom Model: 4-Pillar Foundation",
      highlights: [
        "Academics with purpose",
        "Life skills that stick",
        "Community problem-solving",
        "Passion and identity discovery",
      ],
      link: "/model",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          About Education For All Society
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl shadow-lg overflow-hidden border ${card.borderColor} ${card.bgColor} hover:shadow-xl transition-shadow duration-300 h-full flex flex-col`}
            >
              <div className="p-6 flex-1">
                <h3 className={`text-xl font-bold mb-4 ${card.textColor}`}>
                  {card.title}
                </h3>
                <ul className="space-y-2 mb-6">
                  {card.highlights.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mt-2 mr-2 ${card.textColor}`}
                      ></span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to={card.link}
                  className={`inline-block px-6 py-2 rounded-lg text-white font-medium ${card.buttonColor} transition-colors duration-300 text-center w-full`}
                >
                  Read More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreSection;
