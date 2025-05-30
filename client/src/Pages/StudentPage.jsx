import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaLightbulb, FaProjectDiagram, FaSpinner, FaCamera } from "react-icons/fa";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const StudentPage = ({ authorizationToken }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    classGrade: "",
    section: "",
    phoneNumber: "",
    email: "",
    profilePicture: null,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [imageCache, setImageCache] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [conversationCache, setConversationCache] = useState({});
  const [apiUsage, setApiUsage] = useState({ today: 0, thisWeek: 0, lastRequest: null });
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubmittedProject, setSelectedSubmittedProject] = useState(null);

  const localProjectSuggestions = {
    science: "Create a science experiment demonstrating [concept]",
    art: "Produce an art piece exploring [theme]",
    sports: "Develop a training program for [sport]",
    technology: "Build a simple [technology] project",
    math: "Design a math puzzle about [topic]",
    history: "Create a timeline of [historical event]",
    music: "Compose a short piece in [genre] style",
  };

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
        setStudents(data);
        await Promise.all(
          data.map(async (student) => {
            if (student.profilePicture) {
              await fetchProfilePicture(student.profilePicture);
            }
            if (student.submittedPhotos) {
              await Promise.all(
                student.submittedPhotos.map((photoId) => fetchProfilePicture(photoId))
              );
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

  const filterStudents = () => {
    let results = [...students];
    if (debouncedSearchTerm) {
      results = results.filter(
        (student) =>
          student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    if (selectedClass !== "all") {
      results = results.filter((student) => student.classGrade === selectedClass);
    }
    if (selectedSection !== "all") {
      results = results.filter((student) => student.section === selectedSection);
    }
    setFilteredStudents(results);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData();
    for (const key in newStudent) {
      if (newStudent[key]) formData.append(key, newStudent[key]);
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
          await fetchProfilePicture(data.profilePicture);
        }
        setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", phoneNumber: "", email: "", profilePicture: null });
        setIsAdding(false);
      } else {
        toast.error(data.message || "Failed to add student");
      }
    } catch (error) {
      toast.error("Error adding student");
      console.error("Add student error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveStudentProject = async (studentId, title, description) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students/project`, {
        method: "PUT",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, projectTitle: title, projectDescription: description }),
      });
      const data = await response.json();
      if (response.ok) {
        setStudents((prev) =>
          prev.map((student) =>
            student._id === studentId ? { ...student, project: { title, description } } : student
          )
        );
        toast.success("Project saved successfully!");
      } else {
        toast.error(data.message || "Failed to save project");
      }
    } catch (error) {
      toast.error("Error saving project");
      console.error("Save project error:", error);
    }
  };

  const getLocalSuggestion = (input) => {
    const lowerInput = input.toLowerCase();
    for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
      if (lowerInput.includes(key)) {
        return suggestion
          .replace("[concept]", input.split(" ")[0])
          .replace("[theme]", input.split(" ")[0])
          .replace("[sport]", input.split(" ")[0])
          .replace("[technology]", input.split(" ")[0])
          .replace("[topic]", input.split(" ")[0])
          .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
          .replace("[genre]", input.split(" ")[0]);
      }
    }
    return `Create a project exploring ${input}`;
  };

  const startProjectChat = (student) => {
    setSelectedStudent(student);
    setIsChatOpen(true);
    setChatMessages([]);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const MIN_DELAY = 2000;

    if (timeSinceLastRequest < MIN_DELAY) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
        },
      ]);
      return;
    }

    setLastRequestTime(now);
    const userMessage = { role: "teacher", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    const messagesForApi = chatMessages.map((msg) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    messagesForApi.push({ role: "user", parts: [{ text: chatInput }] });

    const cacheKey = JSON.stringify(messagesForApi);
    if (conversationCache[cacheKey]) {
      setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
      setIsChatLoading(false);
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const studentAge = parseInt(selectedStudent.classGrade) + 5;
      const exchangeCount = messagesForApi.filter((msg) => msg.role === "user").length;

      const systemInstruction = `
        You are a project prediction assistant for school students.
        The student is ${selectedStudent.name}, approximately ${studentAge} years old, in class ${selectedStudent.classGrade}.
        Your goal is to predict a personalized project based on their age, hobbies, and interests within 5-8 exchanges.
        Keep responses concise (1-2 sentences max).
        If this is the first message (exchangeCount = 1), start with: "Hello ${selectedStudent.name}! What do you enjoy doing in your free time?"
        For subsequent messages, do NOT repeat the initial greeting; instead, ask a relevant follow-up question based on the chat history (e.g., "What kind of [interest] do you like?").
        If the user gives vague answers (e.g., "hello"), prompt them with "Tell me more about what you like to do!"
        By exchanges 5-8, predict a project with a title and 1-sentence description (e.g., "Project: Cricket Batting Trainer - Design a practice tool to improve your batting skills.").
        Current exchange count: ${exchangeCount}.
        Chat history: ${JSON.stringify(messagesForApi)}.
      `;

      const chatHistory = messagesForApi.filter((msg, index) => {
        if (exchangeCount === 1) return false;
        return index > 0 || msg.role === "user";
      });

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: { temperature: 0.7, maxOutputTokens: 150 },
      });

      const result = await chat.sendMessage(`${systemInstruction}`);
      const aiResponse = result.response.text();

      if (aiResponse) {
        setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
        setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
        setApiUsage((prev) => ({
          today: prev.today + 1,
          thisWeek: prev.thisWeek + 1,
          lastRequest: new Date().toISOString(),
        }));

        if (exchangeCount >= 5 && aiResponse.includes("Project:")) {
          const [title, description] = aiResponse.split(" - ");
          const projectTitle = title.replace("Project: ", "").trim();
          const projectDescription = description.trim();
          await saveStudentProject(selectedStudent._id, projectTitle, projectDescription);
          setIsChatOpen(false);
        }
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      const localSuggestion = getLocalSuggestion(chatInput);
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
      ]);
      toast.error("Error with Gemini API");
    } finally {
      setIsChatLoading(false);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedStudent(null);
    setChatMessages([]);
    setChatInput("");
  };

  const StudentCard = ({ student }) => (
    <motion.div
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          {student.profilePicture && imageCache[student.profilePicture] ? (
            <img
              src={imageCache[student.profilePicture]}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=64`;
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-semibold shadow-sm">
              {student.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">
            Roll No: <span className="font-medium text-gray-700">{student.rollNo}</span>
          </p>
          <p className="text-sm text-gray-500">
            Class: <span className="font-medium text-gray-700">{student.classGrade}-{student.section}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => startProjectChat(student)}
            className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={student.project?.title ? "Update Project" : "Assign Project"}
          >
            <FaLightbulb className="w-4 h-4" />
          </motion.button>
          {student.project?.title && (
            <motion.button
              onClick={() => setSelectedProject(student)}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="View Assigned Project"
            >
              <FaProjectDiagram className="w-4 h-4" />
            </motion.button>
          )}
          {student.submittedPhotos?.length > 0 && (
            <motion.button
              onClick={() => setSelectedSubmittedProject(student)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="View Submitted Project"
            >
              <FaCamera className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Student Dashboard</h1>
            <p className="mt-2 text-gray-600 text-lg">Effortlessly manage students and their projects</p>
          </div>
          <motion.button
            onClick={() => setIsAdding(true)}
            className="mt-6 md:mt-0 flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="w-5 h-5" />
            <span>Add Student</span>
          </motion.button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              <option value="all">All Classes</option>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                <option key={grade} value={grade}>Class {grade}</option>
              ))}
            </select>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
            >
              <option value="all">All Sections</option>
              {["A", "B", "C", "D"].map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
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

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Add New Student</h3>
                  <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-gray-700">
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAddStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="Roll No."
                        value={newStudent.rollNo}
                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        value={newStudent.classGrade}
                        onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                        required
                      >
                        <option value="">Select Class</option>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
                          <option key={grade} value={grade}>Class {grade}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <select
                        value={newStudent.section}
                        onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                        required
                      >
                        <option value="">Select Section</option>
                        {["A", "B", "C", "D"].map((sec) => (
                          <option key={sec} value={sec}>Section {sec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        value={newStudent.phoneNumber}
                        onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                        pattern="\d{10,15}"
                        title="Phone number must be 10-15 digits (e.g., 1234567890)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="student@example.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
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
                            Upload
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
                      className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSaving}
                      className={`px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 ${
                        isSaving ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                      whileHover={{ scale: isSaving ? 1 : 1.05 }}
                      whileTap={{ scale: isSaving ? 1 : 0.95 }}
                    >
                      {isSaving ? (
                        <>
                          <FaSpinner className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Student</span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200"></div>
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
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
            <FaUserGraduate className="mx-auto text-gray-400 w-20 h-20 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Students Found</h3>
            <p className="text-gray-600 mb-6 text-lg">
              {searchTerm || selectedClass !== "all" || selectedSection !== "all"
                ? "Adjust your filters to find students."
                : "Add a student to get started."}
            </p>
            <motion.button
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="inline mr-2" />
              Add Student
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {isChatOpen && selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
            >
              <div className="bg-indigo-600 text-white p-5 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-lg font-semibold">
                  {selectedStudent.project?.title
                    ? `Update Project - ${selectedStudent.name}`
                    : `Assign Project - ${selectedStudent.name}`}
                </h2>
                <button onClick={closeChat} className="text-white hover:text-gray-200">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-600 py-4">
                    {selectedStudent.project?.title
                      ? "Let’s refine your project—what would you like to change?"
                      : "Let’s find a project for you—tell me about your interests!"}
                  </div>
                )}
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                        message.role === "teacher"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[75%] shadow-sm">
                      <div className="flex items-center space-x-2">
                        <FaSpinner className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isChatLoading}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Type your message..."
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Assigned Project</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <h3 className="text-xl font-medium text-gray-900">{selectedProject.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Class {selectedProject.classGrade}-{selectedProject.section} | Roll No: {selectedProject.rollNo}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-indigo-600">{selectedProject.project.title}</h4>
                  <p className="text-gray-700 mt-1">{selectedProject.project.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <motion.button
                    onClick={() => {
                      setSelectedProject(null);
                      startProjectChat(selectedProject);
                    }}
                    className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Update Project
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedSubmittedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Submitted Project</h2>
                  <button
                    onClick={() => setSelectedSubmittedProject(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <h3 className="text-xl font-medium text-gray-900">{selectedSubmittedProject.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Class {selectedSubmittedProject.classGrade}-{selectedSubmittedProject.section} | Roll No: {selectedSubmittedProject.rollNo}
                </p>
                {selectedSubmittedProject.project?.title && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                    <h4 className="text-lg font-semibold text-indigo-600">{selectedSubmittedProject.project.title}</h4>
                    <p className="text-gray-700 mt-1">{selectedSubmittedProject.project.description}</p>
                  </div>
                )}
                {selectedSubmittedProject.submittedPhotos?.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Submitted Photos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSubmittedProject.submittedPhotos.map((photoId) => (
                        imageCache[photoId] && (
                          <img
                            key={photoId}
                            src={imageCache[photoId]}
                            alt="Submitted project"
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No photos submitted yet.</p>
                )}
                <div className="mt-6 flex justify-end">
                  <motion.button
                    onClick={() => setSelectedSubmittedProject(null)}
                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentPage;