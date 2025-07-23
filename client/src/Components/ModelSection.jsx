import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaBook,
  FaChevronDown,
  FaChevronUp,
  FaHeart,
  FaLightbulb,
  FaUsers,
} from "react-icons/fa";
import ModelImage from "../assets/EFAS_Cover_1.webp"; // Replace with your image path

const ModelSection = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: "1. Academics with Purpose",
      icon: <FaBook className="mr-3 text-[#7d9b76]" />,
      content: (
        <>
          <p className="mb-4">
            We focus only on what truly matters; core skills like literacy,
            numeracy, and communication, taught in ways that connect to real
            life.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>No outdated rote learning</li>
            <li>
              Every child moves at their own pace, no artificial "grade-level"
              pressure
            </li>
            <li>Math through budgeting and games</li>
            <li>
              English through storytelling, persuasive writing, and roleplay
            </li>
          </ul>
          <p className="mt-4 font-medium">
            The goal? Functional knowledge that actually prepares children for
            life.
          </p>
        </>
      ),
    },
    {
      title: "2. Life Skills That Stick",
      icon: <FaHeart className="mr-3 text-[#7d9b76]" />,
      content: (
        <>
          <p className="mb-4">
            Life skills aren't "extra", they're essential. We teach them{" "}
            <em>experientially</em>, not through lectures.
          </p>
          <p className="mb-2">That means:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Emotional awareness and regulation</li>
            <li>Conflict resolution</li>
            <li>Time management and routines</li>
            <li>Self-care and communication skills</li>
          </ul>
          <p className="mt-4 font-medium">
            Children <em>practice</em> these skills daily, reflect regularly,
            and grow from real experience.
          </p>
        </>
      ),
    },
    {
      title: "3. Community Problem-Solving",
      icon: <FaUsers className="mr-3 text-[#7d9b76]" />,
      content: (
        <>
          <p className="mb-4">
            Every six months, our classroom tackles one real issue from the
            local community, like waste management or helping a lonely
            grandparent.
          </p>
          <p className="mb-2">Children will:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Research the problem</li>
            <li>Collaborate on solutions</li>
            <li>Take real-world action</li>
            <li>Reflect on their contribution</li>
          </ul>
          <p className="mt-4 font-medium">
            This builds empathy, agency, and systems thinking, helping kids see
            themselves as <em>problem-solvers</em>, not passive learners.
          </p>
        </>
      ),
    },
    {
      title: "4. Passion and Identity Discovery",
      icon: <FaLightbulb className="mr-3 text-[#7d9b76]" />,
      content: (
        <>
          <p className="mb-4">
            We don't ask "What do you want to be?" We ask: "What excites you?"
          </p>
          <p className="mb-4">
            Through a cycle of{" "}
            <em>exploration + action + reflection using AI chatbot</em>,
            children try small passion projects, whether it's music, animals,
            nature, or art.
          </p>
          <p className="mb-4">
            If it feels right, they go deeper. If not, they try something else.
          </p>
          <p className="font-medium">
            Eventually, these discoveries are linked to skills, purpose, and
            even potential career paths.
          </p>
        </>
      ),
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
          Our Classroom Model: A 4-Pillar Foundation for Real-World Learning
        </motion.h1>

        {/* Model Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <img
            src={ModelImage}
            alt="4-Pillar Classroom Model"
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
                <div className="flex items-center">
                  {section.icon}
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
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
                      <div className="text-lg leading-relaxed">
                        {section.content}
                      </div>
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

export default ModelSection;
