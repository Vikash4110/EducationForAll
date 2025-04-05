import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaUsers, FaChartLine, FaHandshake } from 'react-icons/fa';
import missionImg from '../assets/vecteezy_young-learners-enjoying-hands-on-programming-lessons_55545013.png'; // Replace with your image

const OurMission = () => {
  const missionPoints = [
    {
      icon: <FaBullseye className="text-white text-xl" />,
      title: "Our Vision",
      content: "A world where quality education is accessible to every child, in every community"
    },
    {
      icon: <FaUsers className="text-white text-xl" />,
      title: "Who We Serve",
      content: "Teachers, administrators, and school systems committed to equitable education"
    },
    {
      icon: <FaChartLine className="text-white text-xl" />,
      title: "Measuring Impact",
      content: "We track student outcomes, teacher satisfaction, and systemic improvements"
    },
    {
      icon: <FaHandshake className="text-white text-xl" />,
      title: "Our Partners",
      content: "Collaborating with NGOs, governments, and tech leaders to scale solutions"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-800 to-purple-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our <span className="text-yellow-300">Mission</span> & Values
            </h2>
            
            <div className="relative">
              <div className="absolute -left-8 -top-8 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <p className="text-lg mb-6">
                  We exist to empower educators with technology that adapts to diverse learning needs, 
                  breaking down barriers to quality education worldwide.
                </p>
                <p className="text-lg">
                  Since 2020, we've been bridging the gap between pedagogical expertise and 
                  cutting-edge technology to create classrooms where every student can thrive.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 bg-yellow-400 text-indigo-900 font-semibold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-all shadow-lg"
            >
              Join Our Movement
            </motion.button>
          </motion.div>

          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      {point.icon}
                    </div>
                    <h3 className="text-xl font-bold text-yellow-300">{point.title}</h3>
                  </div>
                  <p className="text-white/90">{point.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 relative  overflow-hidden">
              <img 
                src={missionImg} 
                alt="Team working on mission" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;