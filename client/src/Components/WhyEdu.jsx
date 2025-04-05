import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaChild, FaBalanceScale, FaLightbulb } from 'react-icons/fa';
import educationForAllImg from '../assets/vecteezy_young-learners-enjoying-hands-on-programming-lessons_55545013.png'; // Replace with your image

const WhyEducationForAll = () => {
  const pillars = [
    {
      icon: <FaGlobeAmericas className="text-indigo-600 text-3xl" />,
      title: "Global Impact",
      description: "Education breaks cycles of poverty and drives economic growth worldwide"
    },
    {
      icon: <FaChild className="text-indigo-600 text-3xl" />,
      title: "Equal Opportunity",
      description: "Every child deserves access to quality learning regardless of background"
    },
    {
      icon: <FaBalanceScale className="text-indigo-600 text-3xl" />,
      title: "Social Equity",
      description: "Reduces inequalities and promotes social cohesion"
    },
    {
      icon: <FaLightbulb className="text-indigo-600 text-3xl" />,
      title: "Innovation Engine",
      description: "Educated populations drive technological and societal progress"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why <span className="text-indigo-600">Education For All</span> Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Universal education isn't just a right—it's the foundation for solving humanity's greatest challenges
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={educationForAllImg} 
                alt="Diverse students learning" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      {pillar.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pillar.title}</h3>
                  </div>
                  <p className="text-gray-600">{pillar.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-12 bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-gray-800">
                "Our platform removes barriers by providing educators with tools to reach every student, regardless of learning style or background."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyEducationForAll;