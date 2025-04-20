import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";
import { useNavigate, Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import Img from "../assets/vecteezy_magnificent-abstract-modern-classroom-with-students-and_57453370.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentLogin = () => {
  const [credentials, setCredentials] = useState({ rollNo: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Basic validation
    if (!credentials.rollNo || !credentials.password) {
      toast.error("Please enter both roll number and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/teachers/students/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and redirect
      storeTokenInLS(data.token);
      toast.success("Login successful! Redirecting...");
      navigate("/student-dashboard");

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const bgVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10 overflow-hidden"
      variants={bgVariants}
      animate="animate"
      style={{ backgroundSize: "200% 200%" }}
    >
      <motion.div
        className="hidden lg:flex w-1/2 justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src={Img} alt="Student Login" className="w-3/4 h-auto object-contain" />
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 flex justify-center"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md mx-auto text-center bg-white rounded-3xl py-10 lg:py-12 px-6 lg:px-10 shadow-2xl border border-gray-100">
          <motion.h2
            className="text-4xl font-extrabold text-blue-600 mb-8 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Student Login
          </motion.h2>

          <form onSubmit={handleLogin}>
            <motion.div
              className="relative h-12 w-full mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <input
                type="text"
                name="rollNo"
                value={credentials.rollNo}
                onChange={handleInputChange}
                placeholder=""
                className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-blue-600 shadow-md"
                required
                disabled={isLoading}
              />
              <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600">
                <FontAwesomeIcon icon={faUser} /> <span>Roll Number</span>
              </label>
            </motion.div>

            <motion.div
              className="relative h-12 w-full mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder=""
                className="peer h-full w-full rounded-xl border border-gray-200 bg-transparent px-12 py-3 text-sm text-gray-700 outline-none transition-all placeholder-shown:border-gray-200 focus:border-2 focus:border-blue-600 shadow-md"
                required
                disabled={isLoading}
              />
              <label className="pointer-events-none absolute left-3 -top-4 flex items-center space-x-2 text-xs font-medium text-gray-800 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600">
                <FontAwesomeIcon icon={faLock} /> <span>Password</span>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              className={`py-3 px-6 rounded-full font-semibold text-white w-2/3 mx-auto flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 transition-all duration-300 shadow-md ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {isLoading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                "Login"
              )}
            </motion.button>

            <motion.div
              className="flex flex-col items-center mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                Forgot Password? Contact your teacher.
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentLogin;

