import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./Components/Loader";
import Navbar from "./Components/Navbar";
import ProblemSection from "./Components/ProblemSection";
import About from "./Pages/About";
import Home from "./Pages/Home";
import NotFoundPage from "./Pages/NotFoundPage";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentLogin from "./Pages/StudentLogin";
import TeacherDashboard from "./Pages/TeacherDashboard";
import TeacherLogin from "./Pages/TeacherLogin";
import TeacherProfile from "./Pages/TeacherProfile";
import TeacherRegister from "./Pages/TeacherRegister";
import { AuthProvider } from "./Store/auth";

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
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          <Route path="/about" element={<About />} />
          <Route path="/problem" element={<ProblemSection />} />
          {/* 404 ErrorPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
