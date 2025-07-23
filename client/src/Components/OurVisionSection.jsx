import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import VisionImage from "../assets/EFAS_cover_3m.webp";

const OurVisionSection = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: "1. Ground-Up Transformation",
      content:
        "We're not waiting for top-down reform. We're starting change where it matters most, inside a real classroom, with real children.",
    },
    {
      title: "2. The Grade 2 Lab: Build, Test, Refine",
      content:
        "Our journey begins with a living lab in Grade 2: an effort to reimagine education rooted in purpose, curiosity, and human potential. Rather than overhauling the system overnight, we're building a small, practical, and proven model that we can test, refine, and grow organically and sustainably.",
    },
    {
      title: "3. From Classroom to Community",
      content:
        "This classroom will evolve into a full-school approach and eventually become a model that other schools can adopt and adapt.",
    },
    {
      title: "4. A Scalable Revolution",
      content:
        "Our long-term dream is bold but simple: spark a nationwide shift toward education that nurtures skilled, self-aware, compassionate, and purpose-driven individuals.",
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
          Our Vision: Change Starts in One Classroom
        </motion.h1>

        {/* Vision Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={VisionImage}
            alt="Classroom transformation vision"
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

export default OurVisionSection;
