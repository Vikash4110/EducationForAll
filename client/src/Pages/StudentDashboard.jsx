import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUserGraduate, 
  FaProjectDiagram, 
  FaUpload, 
  FaSignOutAlt, 
  FaSpinner,
  FaCheckCircle,
  FaUserCircle,
  FaIdCard,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaImages
} from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../Store/auth";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user, authorizationToken, logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [imageCache, setImageCache] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile(user);
      if (user.profilePicture) {
        fetchProfilePicture(user.profilePicture);
      }
      if (user.submittedPhotos) {
        user.submittedPhotos.forEach((photoId) => fetchProfilePicture(photoId));
      }
    }
  }, [user]);

  const fetchProfilePicture = async (fileId) => {
    if (imageCache[fileId]) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
      }
    } catch (error) {
      console.error(`Error fetching image:`, error);
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students/upload-photo`, {
        method: "POST",
        headers: { Authorization: authorizationToken },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Photo uploaded successfully");
        setProfile((prev) => ({
          ...prev,
          submittedPhotos: [...(prev.submittedPhotos || []), data.photoId],
        }));
        await fetchProfilePicture(data.photoId);
      } else {
        toast.error(data.message || "Failed to upload photo");
      }
    } catch (error) {
      toast.error("Error uploading photo");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/student-login");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <FaSpinner className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <FaUserGraduate className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {profile.name}</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg hover:shadow-md transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl shadow-sm p-1">
          <motion.button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 py-3 px-6 font-medium rounded-lg transition-all ${
              activeTab === "profile"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <FaUserCircle className="w-4 h-4" />
            <span>Profile</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("project")}
            className={`flex items-center space-x-2 py-3 px-6 font-medium rounded-lg transition-all ${
              activeTab === "project"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <FaProjectDiagram className="w-4 h-4" />
            <span>Project</span>
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <FaIdCard className="text-indigo-600" />
                  <span>Personal Information</span>
                </h2>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    {profile.profilePicture && imageCache[profile.profilePicture] ? (
                      <div className="relative group">
                        <img
                          src={imageCache[profile.profilePicture]}
                          alt={profile.name}
                          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${profile.name}&background=random&size=256`;
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Profile Photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-semibold shadow-sm">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaUserCircle className="text-indigo-600" />
                        <h3 className="font-medium text-gray-900">{profile.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Full Name</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaIdCard className="text-indigo-600" />
                        <h3 className="font-medium text-gray-900">Roll No: {profile.rollNo}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Roll Number</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaGraduationCap className="text-indigo-600" />
                        <h3 className="font-medium text-gray-900">{profile.classGrade}-{profile.section}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Class & Section</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaEnvelope className="text-indigo-600" />
                        <h3 className="font-medium text-gray-900">{profile.email}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Email Address</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <FaPhone className="text-indigo-600" />
                        <h3 className="font-medium text-gray-900">{profile.phoneNumber}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Phone Number</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "project" && (
            <motion.div
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <FaProjectDiagram className="text-indigo-600" />
                  <span>Project Details</span>
                </h2>
              </div>
              <div className="p-6 md:p-8">
                {profile.project?.title ? (
                  <div className="mb-8 bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-indigo-700 mb-1">{profile.project.title}</h3>
                    <p className="text-gray-700">{profile.project.description}</p>
                    {profile.submittedPhotos?.length > 0 && (
                      <motion.div 
                        className="mt-4 inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <FaCheckCircle />
                        <span>Submitted</span>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="mb-8 bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-gray-600">No project assigned yet.</p>
                  </div>
                )}
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3  items-center space-x-2">
                    <FaUpload className="text-indigo-600" />
                    <span>Upload Project Photos</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <motion.label 
                      className="cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:shadow-md transition-all flex items-center space-x-2">
                        {isUploading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <FaUpload />
                            <span>Select Photo</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </motion.label>
                    <p className="text-sm text-gray-500">JPEG, PNG (Max 5MB)</p>
                  </div>
                </div>
                
                {profile.submittedPhotos?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center space-x-2">
                      <FaImages className="text-indigo-600" />
                      <span>Submitted Photos</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {profile.submittedPhotos.map((photoId) => (
                        imageCache[photoId] && (
                          <motion.div 
                            key={photoId}
                            className="relative group overflow-hidden rounded-lg border border-gray-200"
                            whileHover={{ scale: 1.02 }}
                          >
                            <img
                              src={imageCache[photoId]}
                              alt="Submitted project"
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium">Project Photo</span>
                            </div>
                          </motion.div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentDashboard;