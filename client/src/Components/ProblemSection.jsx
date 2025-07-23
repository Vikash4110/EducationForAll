import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProblemImage from "../assets/EFAS_cover_1m.webp"; // Replace with your actual image path

const ProblemSection = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: "Outdated Purpose",
      content:
        "Schools are still designed for the industrial age; focused on discipline, obedience, and rote learning; not for preparing students to thrive in today's dynamic world.",
    },
    {
      title: "Competition Over Contribution",
      content:
        "Students are taught to compete against each other, not collaborate. The focus is on being 'better than others' instead of 'of value to others.'",
    },
    {
      title: "Test-Centric Learning",
      content:
        "Academic success is often reduced to exam scores. Children are trained to memorize and reproduce, rather than understand, question, or innovate.",
    },
    {
      title: "Loss of Human Flourishing",
      content:
        "Education has become a system of standardization, not transformation. The true goal of helping children lead meaningful, contributive lives is often lost.",
    },
    {
      title: "Identity Suppression",
      content:
        "Instead of helping children discover who they are, schools push them into narrow definitions of success. Personal passions and individuality are often sidelined.",
    },
    {
      title: "Neglected Life Skills",
      content:
        "Critical life skills communication, emotional intelligence, resilience, financial literacy are rarely prioritized, leaving students underprepared for real life.",
    },
  ];

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f6f6e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-[#272727] mb-6 pb-4 border-b-2 border-[#7d9b76]"
        >
          The Problem: Why the Modern Education System Needs a Reset
        </motion.h1>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={ProblemImage}
            alt="Modern education system problems"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border border-[#7d9b76]/30 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${
                  activeSection === index
                    ? "bg-[#7d9b76] text-[#f6f6e9]"
                    : "bg-[#272727] text-[#f6f6e9] hover:bg-[#272727]/90"
                }`}
              >
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {activeSection === index ? (
                  <FaChevronUp className="text-lg" />
                ) : (
                  <FaChevronDown className="text-lg" />
                )}
              </button>

              <AnimatePresence>
                {activeSection === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#f6f6e9] text-[#272727]"
                  >
                    <div className="px-6 py-4">
                      <p className="text-lg leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemSection;
