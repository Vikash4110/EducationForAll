import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ChangeImage from "../assets/EFAS_cover_2m.webp"; // Replace with your actual image path

const ChangeSection = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: "Systemic Paralysis",
      content:
        "Progress is blocked not just by outdated policies but by a combination of cultural acceptance, professional uncertainty, and institutional fear.",
    },
    {
      title: "Lack of Real Demand",
      content:
        "Most parents see the current system as 'safe' or 'normal' unaware of how much more empowering education could be. This cultural complacency reduces the pressure to innovate.",
    },
    {
      title: "Willing but Uncertain",
      content:
        "Many schools and educators want to improve, but don't know how. They lack proven models, step-by-step guidance, or real-world examples to follow.",
    },
    {
      title: "Fear of Rejection",
      content:
        "Even visionary leaders hesitate to act. They fear backlash from parents, disapproval from authorities, or being left unsupported by the larger system.",
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
          Why Change in Education Feels Impossible, But Isn't
        </motion.h1>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={ChangeImage}
            alt="Challenges in education reform"
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

export default ChangeSection;
