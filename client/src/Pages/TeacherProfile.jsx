import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaCamera,
  FaChalkboardTeacher,
  FaEdit,
  FaEnvelope,
  FaFileAlt,
  FaGraduationCap,
  FaPhone,
  FaSave,
  FaSchool,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";

const TeacherProfile = () => {
  const { user, isLoading, authorizationToken, logoutUser, isLoggedIn, role } =
    useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    teacherName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    classGrade: "",
    section: "",
    bio: "",
    education: "",
    experience: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef(null);

  // Redirect if not a teacher or not logged in
  useEffect(() => {
    if (!isLoading && (!isLoggedIn || role !== "teacher")) {
      toast.error("Access denied. Teachers only.");
      navigate("/teacher-login");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  // Populate form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        teacherName: user.teacherName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        subject: user.subject || "",
        classGrade: user.classGrade || "",
        section: user.section || "",
        bio:
          user.bio || "Experienced educator passionate about student success",
        education:
          user.education || "M.Ed in Education, University of Education",
        experience: user.experience || "5+ years teaching experience",
      });
      fetchProfilePicture();
    }
  }, [user]);

  // Fetch profile picture if available
  const fetchProfilePicture = async () => {
    if (user?.profilePicture) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${
            user.profilePicture
          }`,
          {
            headers: { Authorization: authorizationToken },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          setProfilePicture(URL.createObjectURL(blob));
        } else {
          console.error("Failed to fetch profile picture");
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/teachers/profile/picture`,
        {
          method: "PUT",
          headers: {
            Authorization: authorizationToken,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfilePicture(URL.createObjectURL(file));
        toast.success("Profile picture updated successfully");
      } else {
        toast.error("Failed to update profile picture");
      }
    } catch (error) {
      toast.error("Error updating profile picture");
      console.error("Update error:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/teachers/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update profile: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Update error:", error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/teacher-login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f6f6e9]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-[#7d9b76] rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-[#7d9b76]/30 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#f6f6e9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Header */}
      <div className="bg-[#272727] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <motion.div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#f6f6e9]/80 shadow-xl relative"
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={
                      profilePicture ||
                      "https://ui-avatars.com/api/?background=7d9b76&color=272727&name=" +
                        user.teacherName
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaCamera className="text-[#f6f6e9] text-2xl" />
                    </button>
                  )}
                </motion.div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#f6f6e9]">
                  {user.teacherName}
                </h1>
                <p className="text-[#7d9b76]">{user.subject} Teacher</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="px-2 py-1 bg-[#7d9b76]/20 text-xs rounded-full text-[#f6f6e9]">
                    Class {user.classGrade}-{user.section}
                  </span>
                  <span className="px-2 py-1 bg-[#7d9b76]/20 text-xs rounded-full text-[#f6f6e9]">
                    5+ Years Experience
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex space-x-4">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#7d9b76] text-[#272727] rounded-lg font-medium flex items-center space-x-2 hover:bg-[#7d9b76]/90 transition-colors shadow-md"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSave className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-[#f6f6e9] text-[#272727] rounded-lg font-medium flex items-center space-x-2 hover:bg-[#f6f6e9]/90 transition-colors shadow-md"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#7d9b76] text-[#272727] rounded-lg font-medium flex items-center space-x-2 hover:bg-[#7d9b76]/90 transition-colors shadow-md"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-[#7d9b76]/30">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-[#7d9b76] text-[#7d9b76]"
                  : "border-transparent text-[#272727]/70 hover:text-[#7d9b76] hover:border-[#7d9b76]/30"
              }`}
            >
              <FaUser className="inline mr-2" /> Profile
            </button>
            {/* <button
              onClick={() => setActiveTab("performance")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "performance" ? "border-[#7d9b76] text-[#7d9b76]" : "border-transparent text-[#272727]/70 hover:text-[#7d9b76] hover:border-[#7d9b76]/30"}`}
            >
              <FaChartLine className="inline mr-2" /> Performance
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "schedule" ? "border-[#7d9b76] text-[#7d9b76]" : "border-transparent text-[#272727]/70 hover:text-[#7d9b76] hover:border-[#7d9b76]/30"}`}
            >
              <FaCalendarAlt className="inline mr-2" /> Schedule
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "students" ? "border-[#7d9b76] text-[#7d9b76]" : "border-transparent text-[#272727]/70 hover:text-[#7d9b76] hover:border-[#7d9b76]/30"}`}
            >
              <FaUsers className="inline mr-2" /> Students
            </button> */}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileField
                        icon={<FaUser className="text-[#7d9b76]" />}
                        label="Full Name"
                        value={formData.teacherName}
                        name="teacherName"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                      />
                      <ProfileField
                        icon={<FaEnvelope className="text-[#7d9b76]" />}
                        label="Email"
                        value={formData.email}
                        name="email"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="email"
                      />
                      <ProfileField
                        icon={<FaPhone className="text-[#7d9b76]" />}
                        label="Phone Number"
                        value={formData.phoneNumber}
                        name="phoneNumber"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="tel"
                      />
                      <ProfileField
                        icon={<FaBook className="text-[#7d9b76]" />}
                        label="Subject"
                        value={formData.subject}
                        name="subject"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                      />
                      <ProfileField
                        icon={<FaSchool className="text-[#7d9b76]" />}
                        label="Class Grade"
                        value={formData.classGrade}
                        name="classGrade"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="select"
                        options={[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11",
                          "12",
                        ]}
                      />
                      <ProfileField
                        icon={<FaGraduationCap className="text-[#7d9b76]" />}
                        label="Section"
                        value={formData.section}
                        name="section"
                        isEditing={isEditing}
                        onChange={handleInputChange}
                        type="select"
                        options={["A", "B", "C", "D"]}
                      />
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                      About Me
                    </h2>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-3 border border-[#7d9b76]/30 rounded-lg focus:ring-2 focus:ring-[#7d9b76] focus:border-[#7d9b76] bg-[#272727] text-[#f6f6e9]"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-[#f6f6e9]/90">{formData.bio}</p>
                    )}
                  </div>

                  {/* Education & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                      <h3 className="font-semibold text-[#f6f6e9] mb-4 flex items-center">
                        <FaGraduationCap className="text-[#7d9b76] mr-2" />{" "}
                        Education
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-[#7d9b76]/30 rounded-lg bg-[#272727] text-[#f6f6e9]"
                        />
                      ) : (
                        <p className="text-[#f6f6e9]/90">
                          {formData.education}
                        </p>
                      )}
                    </div>
                    <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                      <h3 className="font-semibold text-[#f6f6e9] mb-4 flex items-center">
                        <FaChalkboardTeacher className="text-[#7d9b76] mr-2" />{" "}
                        Experience
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-[#7d9b76]/30 rounded-lg bg-[#272727] text-[#f6f6e9]"
                        />
                      ) : (
                        <p className="text-[#f6f6e9]/90">
                          {formData.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats and Actions */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                      Quick Stats
                    </h2>
                    <div className="space-y-4">
                      <StatCard
                        icon={<FaUsers className="text-[#7d9b76]" />}
                        label="Students"
                        value="42"
                        trend="up"
                      />
                      <StatCard
                        icon={<FaBook className="text-[#7d9b76]" />}
                        label="Courses"
                        value="5"
                        trend="steady"
                      />
                      <StatCard
                        icon={<FaFileAlt className="text-[#7d9b76]" />}
                        label="Assignments"
                        value="18"
                        trend="up"
                      />
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-[#272727] rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      <ActivityItem
                        date="Today"
                        action="Graded Math assignments"
                        time="2 hours ago"
                      />
                      <ActivityItem
                        date="Yesterday"
                        action="Posted new lecture materials"
                        time="1 day ago"
                      />
                      <ActivityItem
                        date="Mar 15"
                        action="Conducted parent-teacher meeting"
                        time="3 days ago"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => navigate("/teacher-dashboard")}
                      className="w-full px-4 py-3 bg-[#7d9b76] text-[#272727] rounded-lg font-medium hover:bg-[#7d9b76]/90 transition-colors shadow-sm flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaChalkboardTeacher />
                      <span>Dashboard</span>
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-[#f6f6e9] text-[#272727] rounded-lg font-medium hover:bg-[#f6f6e9]/90 transition-colors shadow-sm flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "performance" && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#272727] rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                  Performance Metrics
                </h2>
                <div className="h-64 bg-[#7d9b76]/10 rounded-lg flex items-center justify-center">
                  <p className="text-[#f6f6e9]/70">
                    Performance charts coming soon
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#272727] rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                  Teaching Schedule
                </h2>
                <div className="h-64 bg-[#7d9b76]/10 rounded-lg flex items-center justify-center">
                  <p className="text-[#f6f6e9]/70">
                    Schedule calendar coming soon
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#272727] rounded-xl shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-[#f6f6e9] mb-6">
                  My Students
                </h2>
                <div className="h-64 bg-[#7d9b76]/10 rounded-lg flex items-center justify-center">
                  <p className="text-[#f6f6e9]/70">Student list coming soon</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({
  icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  type = "text",
  options,
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-[#f6f6e9] flex items-center">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    {isEditing ? (
      type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full p-2 border border-[#7d9b76]/30 rounded-lg focus:ring-2 focus:ring-[#7d9b76] focus:border-[#7d9b76] bg-[#272727] text-[#f6f6e9] shadow-sm"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full p-2 border border-[#7d9b76]/30 rounded-lg focus:ring-2 focus:ring-[#7d9b76] focus:border-[#7d9b76] bg-[#272727] text-[#f6f6e9] shadow-sm"
        />
      )
    ) : (
      <p className="mt-1 text-[#f6f6e9] font-medium p-2 bg-[#7d9b76]/10 rounded-lg">
        {value || "-"}
      </p>
    )}
  </div>
);

// Stat Card Component
const StatCard = ({ icon, label, value, trend }) => (
  <div className="flex items-center p-3 bg-[#7d9b76]/10 rounded-lg">
    <div className="p-2 bg-[#272727] rounded-lg shadow-sm mr-4">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-[#f6f6e9]/80">{label}</p>
      <p className="text-xl font-semibold text-[#f6f6e9]">{value}</p>
    </div>
    <div
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        trend === "up"
          ? "bg-[#7d9b76]/20 text-[#7d9b76]"
          : trend === "down"
          ? "bg-red-100/20 text-red-300"
          : "bg-yellow-100/20 text-yellow-300"
      }`}
    >
      {trend === "up" ? "↑ 12%" : trend === "down" ? "↓ 5%" : "→ 0%"}
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ date, action, time }) => (
  <div className="flex items-start">
    <div className="mr-4 mt-1">
      <div className="w-2 h-2 bg-[#7d9b76] rounded-full"></div>
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-[#f6f6e9]">{action}</p>
      <p className="text-xs text-[#f6f6e9]/70">
        {date} • {time}
      </p>
    </div>
  </div>
);

export default TeacherProfile;
