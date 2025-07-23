// import { AnimatePresence, motion } from "framer-motion";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   FaBars,
//   FaChalkboardTeacher,
//   FaChevronDown,
//   FaChevronUp,
//   FaHome,
//   FaInfoCircle,
//   FaSignOutAlt,
//   FaTimes,
//   FaUser,
// } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuth } from "../Store/auth";
// import Logo from "../assets/EFAS_Logo.webp";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [scrolled, setScrolled] = useState(false);
//   const { isLoggedIn, logoutUser, user, role } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Scroll effect for navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 10) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close mobile menu and dropdown when route changes
//   useEffect(() => {
//     setIsOpen(false);
//     setIsDropdownOpen(false);
//     setIsSearchOpen(false);
//   }, [location]);

//   const handleLogout = () => {
//     logoutUser();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery("");
//       setIsSearchOpen(false);
//     }
//   };

//   // Navigation links with improved structure
//   const navLinks = [
//     { to: "/", text: "Home", icon: <FaHome className="text-lg" /> },
//     { to: "/about", text: "About", icon: <FaInfoCircle className="text-lg" /> },
//   ];

//   // Dashboard and profile links based on role
//   const dashboardLink =
//     role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
//   const profileLink =
//     role === "teacher" ? "/teacher-profile" : "/student-profile";

//   return (
//     <>
//       <motion.nav
//         className={`fixed top-0 left-0  w-full z-50 transition-all duration-300 border-b mb-4
//         bg-[#272727] shadow-lg py-3 border-[#7d9b76]/20 `}
//         initial={{ opacity: 0, y: 0 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="flex justify-between items-center">
//             {/* Logo */}
//             <motion.div className="flex items-center space-x-2">
//               <Link to="/" className="flex items-center space-x-2 group">
//                 <div className=" p-1.5 rounded-lg  transition-colors duration-300 shadow-md">
//                   <img
//                     src={Logo}
//                     alt="Logo"
//                     className="h-16 w-16 object-contain"
//                   />
//                 </div>
//               </Link>
//             </motion.div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center space-x-2">
//               {navLinks.map((link) => (
//                 <div key={link.to} className="relative group">
//                   <Link
//                     to={link.to}
//                     className={`px-5 py-2.5 rounded-lg font-medium flex items-center transition-all duration-300 ${
//                       location.pathname === link.to
//                         ? "text-[#272727] bg-[#7d9b76] shadow-md"
//                         : "text-[#f6f6e9] hover:text-[#272727] hover:bg-[#7d9b76]/90"
//                     }`}
//                   >
//                     <span className="mr-2 opacity-80">{link.icon}</span>
//                     {link.text}
//                     {link.subLinks && (
//                       <FaChevronDown className="ml-2 text-xs opacity-70 group-hover:rotate-180 transition-transform duration-300" />
//                     )}
//                   </Link>

//                   {/* Submenu Dropdown */}
//                   {link.subLinks && (
//                     <div className="absolute left-0 mt-3 w-56 bg-[#f6f6e9] rounded-xl shadow-2xl border border-[#7d9b76]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 overflow-hidden">
//                       {link.subLinks.map((subLink) => (
//                         <Link
//                           key={subLink.to}
//                           to={subLink.to}
//                           className="block px-5 py-3 text-[#272727] hover:bg-[#7d9b76]/10 hover:text-[#7d9b76] transition-colors duration-200 border-b border-[#7d9b76]/10 last:border-b-0 font-medium"
//                         >
//                           {subLink.text}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Right Side Actions */}
//             <div className="flex items-center space-x-4">
//               {isLoggedIn ? (
//                 <div className="relative hidden lg:block" ref={dropdownRef}>
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-[#7d9b76]/20 transition-all duration-300 border border-[#7d9b76]/30"
//                   >
//                     <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7d9b76] to-[#7d9b76]/80 flex items-center justify-center text-[#f6f6e9] font-bold shadow-md">
//                       {user?.teacherName?.charAt(0) ||
//                         user?.studentName?.charAt(0) ||
//                         "U"}
//                     </div>
//                     <span className="font-medium text-[#f6f6e9] text-sm">
//                       {user?.teacherName || user?.studentName || "User"}
//                     </span>
//                     {isDropdownOpen ? (
//                       <FaChevronUp className="text-[#7d9b76] text-xs" />
//                     ) : (
//                       <FaChevronDown className="text-[#7d9b76] text-xs" />
//                     )}
//                   </button>

//                   <AnimatePresence>
//                     {isDropdownOpen && (
//                       <motion.div
//                         className="absolute right-0 mt-3 w-64 bg-[#f6f6e9] rounded-xl shadow-2xl border border-[#7d9b76]/20 overflow-hidden z-50"
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <div className="px-5 py-4 border-b border-[#7d9b76]/20 bg-[#7d9b76]/5">
//                           <p className="text-sm font-semibold text-[#272727]">
//                             {user?.teacherName || user?.studentName || "User"}
//                           </p>
//                           <p className="text-xs text-[#272727]/70 truncate mt-1">
//                             {user?.email || "user@example.com"}
//                           </p>
//                         </div>
//                         <Link
//                           to={profileLink}
//                           className="px-5 py-3 text-[#272727] hover:bg-[#7d9b76]/10 hover:text-[#7d9b76] transition-colors duration-200 flex items-center font-medium"
//                         >
//                           <FaUser className="mr-3 text-[#7d9b76] opacity-70" />{" "}
//                           Profile
//                         </Link>
//                         <Link
//                           to={dashboardLink}
//                           className="px-5 py-3 text-[#272727] hover:bg-[#7d9b76]/10 hover:text-[#7d9b76] transition-colors duration-200 flex items-center font-medium"
//                         >
//                           <FaHome className="mr-3 text-[#7d9b76] opacity-70" />{" "}
//                           Dashboard
//                         </Link>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full text-left px-5 py-3 text-[#272727] hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center border-t border-[#7d9b76]/20 font-medium"
//                         >
//                           <FaSignOutAlt className="mr-3 text-red-500 opacity-70" />{" "}
//                           Logout
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <>
//                   <Link
//                     to="/teacher-login"
//                     className="hidden lg:flex items-center px-5 py-2.5 rounded-lg font-medium text-[#f6f6e9] hover:text-[#7d9b76] hover:bg-[#f6f6e9]/10 transition-all duration-300 border border-[#7d9b76]/30"
//                   >
//                     <FaUser className="mr-2 opacity-80" /> Teacher Login
//                   </Link>
//                   <Link
//                     to="/student-login"
//                     className="hidden lg:flex items-center px-5 py-2.5 bg-[#7d9b76] text-[#272727] rounded-lg font-semibold hover:bg-[#7d9b76]/90 transition-all duration-300 shadow-md hover:shadow-lg"
//                   >
//                     <FaChalkboardTeacher className="mr-2" /> Student Login
//                   </Link>
//                 </>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="lg:hidden p-2.5 text-[#f6f6e9] hover:text-[#7d9b76] hover:bg-[#7d9b76]/10 transition-colors duration-300 rounded-lg border border-[#7d9b76]/30"
//                 aria-label="Menu"
//               >
//                 {isOpen ? (
//                   <FaTimes className="w-5 h-5" />
//                 ) : (
//                   <FaBars className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               className="lg:hidden bg-[#272727] border-t border-[#7d9b76]/20"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <div className="container mx-auto px-4 py-5">
//                 <div className="flex flex-col space-y-2">
//                   {navLinks.map((link) => (
//                     <React.Fragment key={link.to}>
//                       <Link
//                         to={link.to}
//                         className={`px-4 py-3 rounded-lg font-medium flex items-center transition-all duration-300 ${
//                           location.pathname === link.to
//                             ? "bg-[#7d9b76] text-[#272727]"
//                             : "text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76]"
//                         }`}
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <span className="mr-3 opacity-80">{link.icon}</span>
//                         {link.text}
//                       </Link>

//                       {/* Mobile Submenu */}
//                       {link.subLinks && (
//                         <div className="ml-8 pl-4 border-l-2 border-[#7d9b76]/30">
//                           {link.subLinks.map((subLink) => (
//                             <Link
//                               key={subLink.to}
//                               to={subLink.to}
//                               className="block px-4 py-2.5 text-[#f6f6e9]/80 hover:text-[#7d9b76] hover:bg-[#7d9b76]/10 rounded-lg font-medium transition-all duration-200"
//                               onClick={() => setIsOpen(false)}
//                             >
//                               {subLink.text}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </React.Fragment>
//                   ))}

//                   {isLoggedIn ? (
//                     <>
//                       <div className="border-t border-[#7d9b76]/30 my-3"></div>
//                       <Link
//                         to={profileLink}
//                         className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76] transition-all duration-300"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <FaUser className="mr-3 text-[#7d9b76] opacity-70" />{" "}
//                         Profile
//                       </Link>
//                       <Link
//                         to={dashboardLink}
//                         className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76] transition-all duration-300"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <FaHome className="mr-3 text-[#7d9b76] opacity-70" />{" "}
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-red-500/20 hover:text-red-400 text-left transition-all duration-300"
//                       >
//                         <FaSignOutAlt className="mr-3 text-red-500 opacity-70" />{" "}
//                         Logout
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <div className="border-t border-[#7d9b76]/30 my-3"></div>
//                       <Link
//                         to="/teacher-login"
//                         className="px-4 py-3 rounded-lg font-medium flex items-center justify-center bg-[#f6f6e9]/10 text-[#f6f6e9] hover:bg-[#f6f6e9]/20 hover:text-[#7d9b76] transition-all duration-300 border border-[#7d9b76]/30"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <FaUser className="mr-2" /> Teacher Login
//                       </Link>
//                       <Link
//                         to="/student-login"
//                         className="px-4 py-3 rounded-lg font-semibold flex items-center justify-center bg-[#7d9b76] text-[#272727] hover:bg-[#7d9b76]/90 transition-all duration-300 shadow-md"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <FaChalkboardTeacher className="mr-2" /> Student Login
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>
//       <div className="h-8 lg:h-8"></div>
//     </>
//   );
// };

// export default Navbar;

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaInfoCircle,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";
import Logo from "../assets/EFAS_Logo.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, logoutUser, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Navigation links with improved structure
  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome className="text-lg" /> },
    { to: "/about", text: "About", icon: <FaInfoCircle className="text-lg" /> },
  ];

  // Dashboard and profile links based on role
  const dashboardLink =
    role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
  const profileLink =
    role === "teacher" ? "/teacher-profile" : "/student-profile";

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b mb-4
        bg-[#272727] shadow-lg py-3 border-[#7d9b76]/20 ${
          scrolled ? "shadow-lg" : ""
        }`}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
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
                    className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <div key={link.to} className="relative group">
                  <Link
                    to={link.to}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-300 ${
                      location.pathname === link.to
                        ? "text-[#272727] bg-[#7d9b76] shadow-md"
                        : "text-[#f6f6e9] hover:text-[#272727] hover:bg-[#7d9b76]/90"
                    }`}
                    aria-current={
                      location.pathname === link.to ? "page" : undefined
                    }
                  >
                    <span className="mr-2 opacity-80">{link.icon}</span>
                    {link.text}
                    {link.subLinks && (
                      <FaChevronDown className="ml-2 text-xs opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {isLoggedIn ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl hover:bg-[#7d9b76]/20 transition-all duration-300 border border-[#7d9b76]/30"
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#7d9b76] to-[#7d9b76]/80 flex items-center justify-center text-[#f6f6e9] font-bold shadow-md">
                      {user?.teacherName?.charAt(0) ||
                        user?.studentName?.charAt(0) ||
                        "U"}
                    </div>
                    <span className="font-medium text-[#f6f6e9] text-sm hidden sm:inline">
                      {user?.teacherName || user?.studentName || "User"}
                    </span>
                    {isDropdownOpen ? (
                      <FaChevronUp className="text-[#7d9b76] text-xs" />
                    ) : (
                      <FaChevronDown className="text-[#7d9b76] text-xs" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#f6f6e9] rounded-xl shadow-2xl border border-[#7d9b76]/20 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden={!isDropdownOpen}
                      >
                        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-[#7d9b76]/20 bg-[#7d9b76]/5">
                          <p className="text-sm font-semibold text-[#272727] truncate">
                            {user?.teacherName || user?.studentName || "User"}
                          </p>
                          <p className="text-xs text-[#272727]/70 truncate mt-1">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to={profileLink}
                          className="px-4 py-2 sm:px-5 sm:py-3 text-[#272727] hover:bg-[#7d9b76]/10 hover:text-[#7d9b76] transition-colors duration-200 flex items-center font-medium text-sm sm:text-base"
                        >
                          <FaUser className="mr-3 text-[#7d9b76] opacity-70" />{" "}
                          Profile
                        </Link>
                        <Link
                          to={dashboardLink}
                          className="px-4 py-2 sm:px-5 sm:py-3 text-[#272727] hover:bg-[#7d9b76]/10 hover:text-[#7d9b76] transition-colors duration-200 flex items-center font-medium text-sm sm:text-base"
                        >
                          <FaHome className="mr-3 text-[#7d9b76] opacity-70" />{" "}
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 sm:px-5 sm:py-3 text-[#272727] hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center border-t border-[#7d9b76]/20 font-medium text-sm sm:text-base"
                        >
                          <FaSignOutAlt className="mr-3 text-red-500 opacity-70" />{" "}
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/teacher-login"
                    className="hidden lg:flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-[#f6f6e9] hover:text-[#7d9b76] hover:bg-[#f6f6e9]/10 transition-all duration-300 border border-[#7d9b76]/30 text-sm sm:text-base"
                  >
                    <FaUser className="mr-2 opacity-80" /> Teacher
                  </Link>
                  <Link
                    to="/student-login"
                    className="hidden lg:flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-[#7d9b76] text-[#272727] rounded-lg font-semibold hover:bg-[#7d9b76]/90 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    <FaChalkboardTeacher className="mr-2" /> Student
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-[#f6f6e9] hover:text-[#7d9b76] hover:bg-[#7d9b76]/10 transition-colors duration-300 rounded-lg border border-[#7d9b76]/30"
                aria-label="Menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <FaTimes className="w-5 h-5" />
                ) : (
                  <FaBars className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden bg-[#272727] border-t border-[#7d9b76]/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              ref={mobileMenuRef}
              aria-hidden={!isOpen}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <React.Fragment key={link.to}>
                      <Link
                        to={link.to}
                        className={`px-4 py-3 rounded-lg font-medium flex items-center transition-all duration-300 ${
                          location.pathname === link.to
                            ? "bg-[#7d9b76] text-[#272727]"
                            : "text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76]"
                        }`}
                        onClick={() => setIsOpen(false)}
                        aria-current={
                          location.pathname === link.to ? "page" : undefined
                        }
                      >
                        <span className="mr-3 opacity-80">{link.icon}</span>
                        {link.text}
                      </Link>
                    </React.Fragment>
                  ))}

                  {isLoggedIn ? (
                    <>
                      <div className="border-t border-[#7d9b76]/30 my-2"></div>
                      <Link
                        to={profileLink}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76] transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser className="mr-3 text-[#7d9b76] opacity-70" />{" "}
                        Profile
                      </Link>
                      <Link
                        to={dashboardLink}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-[#7d9b76]/20 hover:text-[#7d9b76] transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaHome className="mr-3 text-[#7d9b76] opacity-70" />{" "}
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 rounded-lg font-medium flex items-center text-[#f6f6e9] hover:bg-red-500/20 hover:text-red-400 text-left transition-all duration-300"
                      >
                        <FaSignOutAlt className="mr-3 text-red-500 opacity-70" />{" "}
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-[#7d9b76]/30 my-2"></div>
                      <Link
                        to="/teacher-login"
                        className="px-4 py-3 rounded-lg font-medium flex items-center justify-center bg-[#f6f6e9]/10 text-[#f6f6e9] hover:bg-[#f6f6e9]/20 hover:text-[#7d9b76] transition-all duration-300 border border-[#7d9b76]/30"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaUser className="mr-2" /> Teacher Login
                      </Link>
                      <Link
                        to="/student-login"
                        className="px-4 py-3 rounded-lg font-semibold flex items-center justify-center bg-[#7d9b76] text-[#272727] hover:bg-[#7d9b76]/90 transition-all duration-300 shadow-md mt-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaChalkboardTeacher className="mr-2" /> Student Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <div className="h-5 sm:h-8"></div>{" "}
      {/* Adjust height based on navbar size */}
    </>
  );
};

export default Navbar;
