import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSearch, FaUserGraduate, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const StudentPage = ({ authorizationToken }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    classGrade: "",
    section: "",
    profilePicture: null,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [imageCache, setImageCache] = useState({}); // Cache for profile picture URLs

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [debouncedSearchTerm, students, selectedClass, selectedSection]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched students:", data);
        setStudents(data);
        // Pre-fetch profile pictures
        await Promise.all(
          data.map(async (student) => {
            if (student.profilePicture) {
              await fetchProfilePicture(student.profilePicture);
            }
          })
        );
      } else {
        toast.error(data.message || "Failed to fetch students");
      }
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Fetch students error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfilePicture = async (fileId) => {
    if (imageCache[fileId]) return; // Use cached image if available
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
        console.log(`Fetched image for fileId: ${fileId}`);
      } else {
        console.error(`Failed to fetch image for fileId: ${fileId}, status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching image for fileId: ${fileId}:`, error);
    }
  };

  const filterStudents = () => {
    let results = [...students];

    // Filter by search term
    if (debouncedSearchTerm) {
      results = results.filter((student) =>
        student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by class
    if (selectedClass !== "all") {
      results = results.filter((student) => student.classGrade === selectedClass);
    }

    // Filter by section
    if (selectedSection !== "all") {
      results = results.filter((student) => student.section === selectedSection);
    }

    setFilteredStudents(results);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newStudent) {
      formData.append(key, newStudent[key]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
        method: "POST",
        headers: { Authorization: authorizationToken },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Student added successfully");
        setStudents([...students, data]);
        if (data.profilePicture) {
          await fetchProfilePicture(data.profilePicture); // Fetch new image
        }
        setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", profilePicture: null });
        setIsAdding(false);
      } else {
        toast.error(data.message || "Failed to add student");
      }
    } catch (error) {
      toast.error("Error adding student");
      console.error("Add student error:", error);
    }
  };

  const StudentCard = ({ student }) => (
    <motion.div
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 flex items-start space-x-4">
        <div className="relative">
          {student.profilePicture && imageCache[student.profilePicture] ? (
            <img
              src={imageCache[student.profilePicture]}
              alt={student.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                console.error(`Image load failed for ${student.name}, fileId: ${student.profilePicture}`);
                e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=80`;
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {student.name.charAt(0)}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
            <FaUserGraduate className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          <div className="mt-1 text-sm text-gray-600">
            <p>Roll No: <span className="font-medium">{student.rollNo}</span></p>
            <p>Class: <span className="font-medium">{student.classGrade}-{student.section}</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="mt-2 text-gray-600">Manage your class students and their information</p>
          </div>
          <motion.button
            onClick={() => setIsAdding(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Classes</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                <option key={grade} value={grade}>
                  Class {grade}
                </option>
              ))}
            </select>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Sections</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedClass("all");
                setSelectedSection("all");
              }}
              className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Add Student Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="Enter roll number"
                        value={newStudent.rollNo}
                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        value={newStudent.classGrade}
                        onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Class</option>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                          <option key={grade} value={grade}>
                            Class {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <select
                        value={newStudent.section}
                        onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Section</option>
                        {["A", "B", "C", "D"].map((sec) => (
                          <option key={sec} value={sec}>
                            Section {sec}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {newStudent.profilePicture ? (
                            <img
                              src={URL.createObjectURL(newStudent.profilePicture)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUserGraduate className="text-gray-400 w-6 h-6" />
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Choose File
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewStudent({ ...newStudent, profilePicture: e.target.files[0] })}
                            className="hidden"
                          />
                        </label>
                        {newStudent.profilePicture && (
                          <button
                            type="button"
                            onClick={() => setNewStudent({ ...newStudent, profilePicture: null })}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                    >
                      Save Student
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Students Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaUserGraduate className="text-gray-400 w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedClass !== "all" || selectedSection !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first student to get started"}
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FaPlus className="inline mr-2" />
              Add Student
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;