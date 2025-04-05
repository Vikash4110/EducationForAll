import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Store/auth";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Loader from "./Components/Loader"; 
import NotFoundPage from "./Pages/NotFoundPage";
import TeacherLogin from "./Pages/TeacherLogin";
import TeacherRegister from "./Pages/TeacherRegister";
import TeacherDashboard from "./Pages/TeacherDashboard";
import TeacherProfile from "./Pages/TeacherProfile";
import About from "./Pages/About";

function App() {
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");

    if (!hasLoaded) {
      setIsLoading(true); 
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoaded", "true");
      }, 2500); 

      return () => clearTimeout(timer); 
    }
  }, []);

  return (
    <AuthProvider>
      {isLoading && <Loader />}
      <div className={`${isLoading ? "hidden" : "block"}`}>
        <Navbar />
        <Routes>
        {/* TeacherRoutes */}
          <Route path="/" element={<Home />} />
          <Route path="/teacher-login" element={<TeacherLogin />} />
          <Route path="/teacher-register" element={<TeacherRegister />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/about" element={<About />} />
          {/* 404 ErrorPage */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </div>
     </AuthProvider>

  );
}

export default App;