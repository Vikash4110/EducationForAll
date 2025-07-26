import React from "react";
import { Route, Routes } from "react-router-dom";
import ChangeSection from "./Components/ChangeSection";
import ModelSection from "./Components/ModelSection";
import Navbar from "./Components/Navbar";
import OurVisionSection from "./Components/OurVisionSection";
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
  return (
    <AuthProvider>
      <div>
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
          <Route path="/change" element={<ChangeSection />} />
          <Route path="/our-vision" element={<OurVisionSection />} />
          <Route path="/model" element={<ModelSection />} />

          {/* 404 ErrorPage */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
