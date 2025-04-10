// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaComments } from "react-icons/fa";
// import { toast } from "sonner";
// import { useDebounce } from "use-debounce";

// const StudentPage = ({ authorizationToken }) => {
//   // Student data state
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     rollNo: "",
//     classGrade: "",
//     section: "",
//     profilePicture: null,
//   });
  
//   // UI state
//   const [isAdding, setIsAdding] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedSection, setSelectedSection] = useState("all");
//   const [imageCache, setImageCache] = useState({});

//   // Chat system state
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [lastRequestTime, setLastRequestTime] = useState(0);
//   const [conversationCache, setConversationCache] = useState({});
//   const [retryDelays, setRetryDelays] = useState({});
//   const [apiUsage, setApiUsage] = useState({
//     today: 0,
//     thisWeek: 0,
//     lastRequest: null
//   });

//   // Local project suggestions fallback
//   const localProjectSuggestions = {
//     science: "Create a science experiment demonstrating [concept]",
//     art: "Produce an art piece exploring [theme]",
//     sports: "Develop a training program for [sport]",
//     technology: "Build a simple [technology] project",
//     math: "Design a math puzzle about [topic]",
//     history: "Create a timeline of [historical event]",
//     music: "Compose a short piece in [genre] style"
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [debouncedSearchTerm, students, selectedClass, selectedSection]);

//   const fetchStudents = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudents(data);
//         await Promise.all(
//           data.map(async (student) => {
//             if (student.profilePicture) {
//               await fetchProfilePicture(student.profilePicture);
//             }
//           })
//         );
//       } else {
//         toast.error(data.message || "Failed to fetch students");
//       }
//     } catch (error) {
//       toast.error("Error fetching students");
//       console.error("Fetch students error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProfilePicture = async (fileId) => {
//     if (imageCache[fileId]) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
//       }
//     } catch (error) {
//       console.error(`Error fetching image:`, error);
//     }
//   };

//   const filterStudents = () => {
//     let results = [...students];

//     if (debouncedSearchTerm) {
//       results = results.filter((student) =>
//         student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//         student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       );
//     }

//     if (selectedClass !== "all") {
//       results = results.filter((student) => student.classGrade === selectedClass);
//     }

//     if (selectedSection !== "all") {
//       results = results.filter((student) => student.section === selectedSection);
//     }

//     setFilteredStudents(results);
//   };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (const key in newStudent) {
//       formData.append(key, newStudent[key]);
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         method: "POST",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Student added successfully");
//         setStudents([...students, data]);
//         if (data.profilePicture) {
//           await fetchProfilePicture(data.profilePicture);
//         }
//         setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", profilePicture: null });
//         setIsAdding(false);
//       } else {
//         toast.error(data.message || "Failed to add student");
//       }
//     } catch (error) {
//       toast.error("Error adding student");
//       console.error("Add student error:", error);
//     }
//   };

//   const getLocalSuggestion = (input) => {
//     const lowerInput = input.toLowerCase();
//     for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
//       if (lowerInput.includes(key)) {
//         return suggestion
//           .replace('[concept]', input.split(' ')[0])
//           .replace('[theme]', input.split(' ')[0])
//           .replace('[sport]', input.split(' ')[0])
//           .replace('[technology]', input.split(' ')[0])
//           .replace('[topic]', input.split(' ')[0])
//           .replace('[historical event]', input.split(' ')[0] + " " + input.split(' ')[1])
//           .replace('[genre]', input.split(' ')[0]);
//       }
//     }
//     return `Create a project exploring ${input}`;
//   };

//   const startProjectChat = (student) => {
//     setSelectedStudent(student);
//     setIsChatOpen(true);
//     setChatMessages([
//       { 
//         role: "ai", 
//         content: `Hello ${student.name}! I'm your project assistant. Let's find a perfect project for you.` 
//       },
//       { 
//         role: "ai", 
//         content: "What subjects or activities are you most interested in? (e.g., science, art, sports, technology)" 
//       }
//     ]);
//   };

//   const handleSendMessage = async () => {
//     // Basic validation
//     if (!chatInput.trim() || isChatLoading) return;

//     // Rate limiting - minimum 1.5 seconds between requests
//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;
    
//     if (timeSinceLastRequest < 1500) {
//       setChatMessages(prev => [...prev, { 
//         role: "ai", 
//         content: "Please wait a moment before sending another message (1.5s cooldown)." 
//       }]);
//       return;
//     }

//     setLastRequestTime(now);

//     // Add user message to chat
//     const userMessage = { role: "teacher", content: chatInput };
//     setChatMessages(prev => [...prev, userMessage]);
//     setChatInput("");
//     setIsChatLoading(true);

//     // Prepare conversation history for API
//     const messagesForApi = [
//       {
//         role: "system",
//         content: `You are a helpful project recommendation assistant for school students. 
//         The student you're talking to is ${selectedStudent.name} in class ${selectedStudent.classGrade}. 
//         Ask questions to understand their interests and suggest a personalized project. 
//         Keep responses concise (1-2 sentences max). After 3-4 exchanges, suggest a specific 
//         project with a title and 1-sentence description.`
//       },
//       ...chatMessages.map(msg => ({
//         role: msg.role === "ai" ? "assistant" : "user",
//         content: msg.content
//       })),
//       { role: "user", content: chatInput }
//     ];

//     // Check cache first
//     const cacheKey = JSON.stringify(messagesForApi);
//     if (conversationCache[cacheKey]) {
//       setChatMessages(prev => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
//       setIsChatLoading(false);
//       return;
//     }

//     // Retry configuration
//     const maxRetries = 2; // Reduced to minimize wait time
//     let retryCount = retryDelays[cacheKey]?.count || 0;
//     const baseDelay = 2000; // 2 seconds base delay

//     const makeRequest = async () => {
//       try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
//           },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: messagesForApi,
//             temperature: 0.7,
//             max_tokens: 150 // Reduced to minimize token usage
//           })
//         });

//         // Handle rate limiting
//         if (response.status === 429) {
//           const retryAfter = response.headers.get('Retry-After') || 
//                           Math.min(baseDelay * Math.pow(2, retryCount), 30000);
          
//           if (retryCount < maxRetries) {
//             setRetryDelays(prev => ({
//               ...prev,
//               [cacheKey]: {
//                 count: retryCount + 1,
//                 delay: retryAfter
//               }
//             }));

//             await new Promise(resolve => setTimeout(resolve, retryAfter));
//             return makeRequest();
//           }
//           // Fallback to local suggestions if API is unavailable
//           const localSuggestion = getLocalSuggestion(chatInput);
//           setChatMessages(prev => [...prev, { 
//             role: "ai", 
//             content: `API is currently busy. Here's a suggestion: ${localSuggestion}` 
//           }]);
//           return;
//         }

//         if (!response.ok) {
//           throw new Error(`API request failed with status ${response.status}`);
//         }

//         const data = await response.json();
//         const aiResponse = data.choices[0]?.message?.content;

//         if (aiResponse) {
//           // Cache the successful response
//           setConversationCache(prev => ({ ...prev, [cacheKey]: aiResponse }));
//           setChatMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
//           setApiUsage(prev => ({
//             today: prev.today + 1,
//             thisWeek: prev.thisWeek + 1,
//             lastRequest: new Date().toISOString()
//           }));
          
//           // Reset retry count for this conversation path
//           setRetryDelays(prev => {
//             const newDelays = {...prev};
//             delete newDelays[cacheKey];
//             return newDelays;
//           });
//         }
//       } catch (error) {
//         console.error("Chat API error:", error);
//         // Fallback to local suggestions on error
//         const localSuggestion = getLocalSuggestion(chatInput);
//         setChatMessages(prev => [...prev, { 
//           role: "ai", 
//           content: `Having trouble connecting. Try this: ${localSuggestion}` 
//         }]);
//       } finally {
//         setIsChatLoading(false);
//       }
//     };

//     // Initial request
//     await makeRequest();
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedStudent(null);
//     setChatMessages([]);
//     setChatInput("");
//   };

//   const StudentCard = ({ student }) => (
//     <motion.div
//       className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="p-6 flex items-start space-x-4">
//         <div className="relative">
//           {student.profilePicture && imageCache[student.profilePicture] ? (
//             <img
//               src={imageCache[student.profilePicture]}
//               alt={student.name}
//               className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=80`;
//               }}
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
//               {student.name.charAt(0)}
//             </div>
//           )}
//           <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
//             <FaUserGraduate className="w-4 h-4" />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
//           <div className="mt-1 text-sm text-gray-600">
//             <p>Roll No: <span className="font-medium">{student.rollNo}</span></p>
//             <p>Class: <span className="font-medium">{student.classGrade}-{student.section}</span></p>
//           </div>
//         </div>
//         <button
//           onClick={() => startProjectChat(student)}
//           className="mt-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
//           title="Get Project Recommendation"
//         >
//           <FaComments className="w-5 h-5" />
//         </button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
//             <p className="mt-2 text-gray-600">Manage your class students and their information</p>
//           </div>
//           <motion.button
//             onClick={() => setIsAdding(true)}
//             className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Add New Student</span>
//           </motion.button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Classes</option>
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                 <option key={grade} value={grade}>
//                   Class {grade}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Sections</option>
//               {["A", "B", "C", "D"].map((sec) => (
//                 <option key={sec} value={sec}>
//                   Section {sec}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedClass("all");
//                 setSelectedSection("all");
//               }}
//               className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Add Student Form */}
//         <AnimatePresence>
//           {isAdding && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-8 overflow-hidden"
//             >
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
//                   <button
//                     onClick={() => setIsAdding(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <FaTimes className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleAddStudent}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={newStudent.name}
//                         onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                       <input
//                         type="text"
//                         placeholder="Enter roll number"
//                         value={newStudent.rollNo}
//                         onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
//                       <select
//                         value={newStudent.classGrade}
//                         onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Class</option>
//                         {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                           <option key={grade} value={grade}>
//                             Class {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
//                       <select
//                         value={newStudent.section}
//                         onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Section</option>
//                         {["A", "B", "C", "D"].map((sec) => (
//                           <option key={sec} value={sec}>
//                             Section {sec}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                           {newStudent.profilePicture ? (
//                             <img
//                               src={URL.createObjectURL(newStudent.profilePicture)}
//                               alt="Preview"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <FaUserGraduate className="text-gray-400 w-6 h-6" />
//                           )}
//                         </div>
//                         <label className="cursor-pointer">
//                           <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                             Choose File
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setNewStudent({ ...newStudent, profilePicture: e.target.files[0] })}
//                             className="hidden"
//                           />
//                         </label>
//                         {newStudent.profilePicture && (
//                           <button
//                             type="button"
//                             onClick={() => setNewStudent({ ...newStudent, profilePicture: null })}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-8 flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsAdding(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                     >
//                       Save Student
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Students Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 rounded-full bg-gray-200"></div>
//                   <div className="space-y-2 flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredStudents.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredStudents.map((student) => (
//               <StudentCard key={student._id} student={student} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <FaUserGraduate className="text-gray-400 w-12 h-12" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm || selectedClass !== "all" || selectedSection !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Add your first student to get started"}
//             </p>
//             <button
//               onClick={() => setIsAdding(true)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//             >
//               <FaPlus className="inline mr-2" />
//               Add Student
//             </button>
//           </div>
//         )}

//         {/* Project Recommendation Chat */}
//         <AnimatePresence>
//           {isChatOpen && selectedStudent && (
//             <motion.div
//               initial={{ opacity: 0, x: "100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "100%" }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden"
//             >
//               <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">
//                   Project Assistant for {selectedStudent.name}
//                 </h2>
//                 <button onClick={closeChat} className="text-white hover:text-indigo-200">
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-3 rounded-lg ${
//                         message.role === "teacher"
//                           ? "bg-indigo-500 text-white rounded-br-none"
//                           : "bg-gray-100 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//                 {isChatLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
//                       <div className="flex items-center space-x-2">
//                         <span>Thinking...</span>
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     disabled={isChatLoading}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                     placeholder="Type your response..."
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!chatInput.trim() || isChatLoading}
//                     className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-2 flex justify-between">
//                   <span>API calls today: {apiUsage.today}</span>
//                   {apiUsage.lastRequest && (
//                     <span>Last response: {new Date(apiUsage.lastRequest).toLocaleTimeString()}</span>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default StudentPage; 


// NO DELAY CODE 
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaComments } from "react-icons/fa";
// import { toast } from "sonner";
// import { useDebounce } from "use-debounce";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// const StudentPage = ({ authorizationToken }) => {
//   // Student data state
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     rollNo: "",
//     classGrade: "",
//     section: "",
//     profilePicture: null,
//   });

//   // UI state
//   const [isAdding, setIsAdding] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedSection, setSelectedSection] = useState("all");
//   const [imageCache, setImageCache] = useState({});

//   // Chat system state
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [lastRequestTime, setLastRequestTime] = useState(0);
//   const [conversationCache, setConversationCache] = useState({});
//   const [apiUsage, setApiUsage] = useState({
//     today: 0,
//     thisWeek: 0,
//     lastRequest: null,
//   });

//   // Local project suggestions fallback
//   const localProjectSuggestions = {
//     science: "Create a science experiment demonstrating [concept]",
//     art: "Produce an art piece exploring [theme]",
//     sports: "Develop a training program for [sport]",
//     technology: "Build a simple [technology] project",
//     math: "Design a math puzzle about [topic]",
//     history: "Create a timeline of [historical event]",
//     music: "Compose a short piece in [genre] style",
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [debouncedSearchTerm, students, selectedClass, selectedSection]);

//   const fetchStudents = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudents(data);
//         await Promise.all(
//           data.map(async (student) => {
//             if (student.profilePicture) {
//               await fetchProfilePicture(student.profilePicture);
//             }
//           })
//         );
//       } else {
//         toast.error(data.message || "Failed to fetch students");
//       }
//     } catch (error) {
//       toast.error("Error fetching students");
//       console.error("Fetch students error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProfilePicture = async (fileId) => {
//     if (imageCache[fileId]) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
//       }
//     } catch (error) {
//       console.error(`Error fetching image:`, error);
//     }
//   };

//   const filterStudents = () => {
//     let results = [...students];

//     if (debouncedSearchTerm) {
//       results = results.filter(
//         (student) =>
//           student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//           student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       );
//     }

//     if (selectedClass !== "all") {
//       results = results.filter((student) => student.classGrade === selectedClass);
//     }

//     if (selectedSection !== "all") {
//       results = results.filter((student) => student.section === selectedSection);
//     }

//     setFilteredStudents(results);
//   };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (const key in newStudent) {
//       formData.append(key, newStudent[key]);
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         method: "POST",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Student added successfully");
//         setStudents([...students, data]);
//         if (data.profilePicture) {
//           await fetchProfilePicture(data.profilePicture);
//         }
//         setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", profilePicture: null });
//         setIsAdding(false);
//       } else {
//         toast.error(data.message || "Failed to add student");
//       }
//     } catch (error) {
//       toast.error("Error adding student");
//       console.error("Add student error:", error);
//     }
//   };

//   const getLocalSuggestion = (input) => {
//     const lowerInput = input.toLowerCase();
//     for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
//       if (lowerInput.includes(key)) {
//         return suggestion
//           .replace("[concept]", input.split(" ")[0])
//           .replace("[theme]", input.split(" ")[0])
//           .replace("[sport]", input.split(" ")[0])
//           .replace("[technology]", input.split(" ")[0])
//           .replace("[topic]", input.split(" ")[0])
//           .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
//           .replace("[genre]", input.split(" ")[0]);
//       }
//     }
//     return `Create a project exploring ${input}`;
//   };

//   const startProjectChat = (student) => {
//     setSelectedStudent(student);
//     setIsChatOpen(true);
//     setChatMessages([]);
//   };

//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || isChatLoading) return;

//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;

//     const MIN_DELAY = 3000;
//     if (timeSinceLastRequest < MIN_DELAY) {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
//         },
//       ]);
//       return;
//     }

//     setLastRequestTime(now);

//     const userMessage = { role: "teacher", content: chatInput };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setIsChatLoading(true);

//     const messagesForApi = chatMessages.map((msg) => ({
//       role: msg.role === "ai" ? "model" : "user",
//       parts: [{ text: msg.content }],
//     }));

//     messagesForApi.push({ role: "user", parts: [{ text: chatInput }] });

//     const cacheKey = JSON.stringify(messagesForApi);
//     if (conversationCache[cacheKey]) {
//       setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
//       setIsChatLoading(false);
//       return;
//     }

//     try {
//       // Use gemini-1.5-pro instead of gemini-1.0-pro
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       const systemInstruction =
//         chatMessages.length === 0
//           ? `You are a helpful project recommendation assistant for school students. 
//              The student you're talking to is ${selectedStudent.name} in class ${selectedStudent.classGrade}. 
//              Ask questions to understand their interests and suggest a personalized project. 
//              Keep responses concise (1-2 sentences max). After 3-4 exchanges, suggest a specific 
//              project with a title and 1-sentence description. 
//              Start by saying: "Hello ${selectedStudent.name}! I'm your project assistant. Let's find a perfect project for you."`
//           : `You are a helpful project recommendation assistant for school students. 
//              The student you're talking to is ${selectedStudent.name} in class ${selectedStudent.classGrade}. 
//              Ask questions to understand their interests and suggest a personalized project. 
//              Keep responses concise (1-2 sentences max). After 3-4 exchanges, suggest a specific 
//              project with a title and 1-sentence description.`;

//       const chat = model.startChat({
//         history: messagesForApi.length > 1 ? messagesForApi.slice(0, -1) : [],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 150,
//         },
//       });

//       const result = await chat.sendMessage(`${systemInstruction}\n\n${chatInput}`);
//       const aiResponse = result.response.text();

//       if (aiResponse) {
//         setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
//         setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
//         setApiUsage((prev) => ({
//           today: prev.today + 1,
//           thisWeek: prev.thisWeek + 1,
//           lastRequest: new Date().toISOString(),
//         }));
//       }
//     } catch (error) {
//       console.error("Gemini API error:", error);
//       const localSuggestion = getLocalSuggestion(chatInput);
//       setChatMessages((prev) => [
//         ...prev,
//         { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
//       ]);
//       toast.error("Error with Gemini API");
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedStudent(null);
//     setChatMessages([]);
//     setChatInput("");
//   };

//   const StudentCard = ({ student }) => (
//     <motion.div
//       className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="p-6 flex items-start space-x-4">
//         <div className="relative">
//           {student.profilePicture && imageCache[student.profilePicture] ? (
//             <img
//               src={imageCache[student.profilePicture]}
//               alt={student.name}
//               className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=80`;
//               }}
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
//               {student.name.charAt(0)}
//             </div>
//           )}
//           <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
//             <FaUserGraduate className="w-4 h-4" />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
//           <div className="mt-1 text-sm text-gray-600">
//             <p>
//               Roll No: <span className="font-medium">{student.rollNo}</span>
//             </p>
//             <p>
//               Class: <span className="font-medium">{student.classGrade}-{student.section}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => startProjectChat(student)}
//           className="mt-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
//           title="Get Project Recommendation"
//         >
//           <FaComments className="w-5 h-5" />
//         </button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
//             <p className="mt-2 text-gray-600">Manage your class students and their information</p>
//           </div>
//           <motion.button
//             onClick={() => setIsAdding(true)}
//             className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Add New Student</span>
//           </motion.button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Classes</option>
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                 <option key={grade} value={grade}>
//                   Class {grade}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Sections</option>
//               {["A", "B", "C", "D"].map((sec) => (
//                 <option key={sec} value={sec}>
//                   Section {sec}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedClass("all");
//                 setSelectedSection("all");
//               }}
//               className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Add Student Form */}
//         <AnimatePresence>
//           {isAdding && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-8 overflow-hidden"
//             >
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
//                   <button
//                     onClick={() => setIsAdding(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <FaTimes className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleAddStudent}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={newStudent.name}
//                         onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                       <input
//                         type="text"
//                         placeholder="Enter roll number"
//                         value={newStudent.rollNo}
//                         onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
//                       <select
//                         value={newStudent.classGrade}
//                         onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Class</option>
//                         {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                           <option key={grade} value={grade}>
//                             Class {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
//                       <select
//                         value={newStudent.section}
//                         onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Section</option>
//                         {["A", "B", "C", "D"].map((sec) => (
//                           <option key={sec} value={sec}>
//                             Section {sec}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                           {newStudent.profilePicture ? (
//                             <img
//                               src={URL.createObjectURL(newStudent.profilePicture)}
//                               alt="Preview"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <FaUserGraduate className="text-gray-400 w-6 h-6" />
//                           )}
//                         </div>
//                         <label className="cursor-pointer">
//                           <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                             Choose File
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setNewStudent({ ...newStudent, profilePicture: e.target.files[0] })}
//                             className="hidden"
//                           />
//                         </label>
//                         {newStudent.profilePicture && (
//                           <button
//                             type="button"
//                             onClick={() => setNewStudent({ ...newStudent, profilePicture: null })}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-8 flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsAdding(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                     >
//                       Save Student
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Students Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 rounded-full bg-gray-200"></div>
//                   <div className="space-y-2 flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredStudents.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredStudents.map((student) => (
//               <StudentCard key={student._id} student={student} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <FaUserGraduate className="text-gray-400 w-12 h-12" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm || selectedClass !== "all" || selectedSection !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Add your first student to get started"}
//             </p>
//             <button
//               onClick={() => setIsAdding(true)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//             >
//               <FaPlus className="inline mr-2" />
//               Add Student
//             </button>
//           </div>
//         )}

//         {/* Project Recommendation Chat */}
//         <AnimatePresence>
//           {isChatOpen && selectedStudent && (
//             <motion.div
//               initial={{ opacity: 0, x: "100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "100%" }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden"
//             >
//               <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">
//                   Project Assistant for {selectedStudent.name}
//                 </h2>
//                 <button onClick={closeChat} className="text-white hover:text-indigo-200">
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                 {chatMessages.length === 0 && (
//                   <div className="text-gray-500 text-center">
//                     Start by telling me what you’re interested in (e.g., science, art, sports)!
//                   </div>
//                 )}
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-3 rounded-lg ${
//                         message.role === "teacher"
//                           ? "bg-indigo-500 text-white rounded-br-none"
//                           : "bg-gray-100 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//                 {isChatLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
//                       <div className="flex items-center space-x-2">
//                         <span>Thinking...</span>
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     disabled={isChatLoading}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                     placeholder="Type your response..."
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!chatInput.trim() || isChatLoading}
//                     className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-2 flex justify-between">
//                   <span>API calls today: {apiUsage.today}</span>
//                   {apiUsage.lastRequest && (
//                     <span>Last response: {new Date(apiUsage.lastRequest).toLocaleTimeString()}</span>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default StudentPage;

  // 30 SECOND DELAY CODE 

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaComments } from "react-icons/fa";
// import { toast } from "sonner";
// import { useDebounce } from "use-debounce";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// const StudentPage = ({ authorizationToken }) => {
//   // Student data state
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     rollNo: "",
//     classGrade: "",
//     section: "",
//     profilePicture: null,
//   });

//   // UI state
//   const [isAdding, setIsAdding] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedSection, setSelectedSection] = useState("all");
//   const [imageCache, setImageCache] = useState({});

//   // Chat system state
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [lastRequestTime, setLastRequestTime] = useState(0);
//   const [conversationCache, setConversationCache] = useState({});
//   const [apiUsage, setApiUsage] = useState({
//     today: 0,
//     thisWeek: 0,
//     lastRequest: null,
//   });

//   // Local project suggestions fallback
//   const localProjectSuggestions = {
//     science: "Create a science experiment demonstrating [concept]",
//     art: "Produce an art piece exploring [theme]",
//     sports: "Develop a training program for [sport]",
//     technology: "Build a simple [technology] project",
//     math: "Design a math puzzle about [topic]",
//     history: "Create a timeline of [historical event]",
//     music: "Compose a short piece in [genre] style",
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [debouncedSearchTerm, students, selectedClass, selectedSection]);

//   const fetchStudents = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudents(data);
//         await Promise.all(
//           data.map(async (student) => {
//             if (student.profilePicture) {
//               await fetchProfilePicture(student.profilePicture);
//             }
//           })
//         );
//       } else {
//         toast.error(data.message || "Failed to fetch students");
//       }
//     } catch (error) {
//       toast.error("Error fetching students");
//       console.error("Fetch students error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProfilePicture = async (fileId) => {
//     if (imageCache[fileId]) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
//       }
//     } catch (error) {
//       console.error(`Error fetching image:`, error);
//     }
//   };

//   const filterStudents = () => {
//     let results = [...students];

//     if (debouncedSearchTerm) {
//       results = results.filter(
//         (student) =>
//           student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//           student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       );
//     }

//     if (selectedClass !== "all") {
//       results = results.filter((student) => student.classGrade === selectedClass);
//     }

//     if (selectedSection !== "all") {
//       results = results.filter((student) => student.section === selectedSection);
//     }

//     setFilteredStudents(results);
//   };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (const key in newStudent) {
//       formData.append(key, newStudent[key]);
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         method: "POST",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Student added successfully");
//         setStudents([...students, data]);
//         if (data.profilePicture) {
//           await fetchProfilePicture(data.profilePicture);
//         }
//         setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", profilePicture: null });
//         setIsAdding(false);
//       } else {
//         toast.error(data.message || "Failed to add student");
//       }
//     } catch (error) {
//       toast.error("Error adding student");
//       console.error("Add student error:", error);
//     }
//   };

//   const getLocalSuggestion = (input) => {
//     const lowerInput = input.toLowerCase();
//     for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
//       if (lowerInput.includes(key)) {
//         return suggestion
//           .replace("[concept]", input.split(" ")[0])
//           .replace("[theme]", input.split(" ")[0])
//           .replace("[sport]", input.split(" ")[0])
//           .replace("[technology]", input.split(" ")[0])
//           .replace("[topic]", input.split(" ")[0])
//           .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
//           .replace("[genre]", input.split(" ")[0]);
//       }
//     }
//     return `Create a project exploring ${input}`;
//   };

//   const startProjectChat = (student) => {
//     setSelectedStudent(student);
//     setIsChatOpen(true);
//     setChatMessages([]);
//   };

//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || isChatLoading) return;

//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;

//     const MIN_DELAY = 30000; // Changed to 30 seconds
//     if (timeSinceLastRequest < MIN_DELAY) {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
//         },
//       ]);
//       return;
//     }

//     setLastRequestTime(now);

//     const userMessage = { role: "teacher", content: chatInput };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setIsChatLoading(true);

//     const messagesForApi = chatMessages.map((msg) => ({
//       role: msg.role === "ai" ? "model" : "user",
//       parts: [{ text: msg.content }],
//     }));

//     messagesForApi.push({ role: "user", parts: [{ text: chatInput }] });

//     const cacheKey = JSON.stringify(messagesForApi);
//     if (conversationCache[cacheKey]) {
//       setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
//       setIsChatLoading(false);
//       return;
//     }

//     try {
//       // Use gemini-1.5-pro instead of gemini-1.0-pro
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       const systemInstruction =
//         chatMessages.length === 0
//           ? `You are a helpful project recommendation assistant for school students. 
//              The student you're talking to is ${selectedStudent.name} in class ${selectedStudent.classGrade}. 
//              Ask questions to understand their interests and suggest a personalized project. 
//              Keep responses concise (1-2 sentences max). After 3-4 exchanges, suggest a specific 
//              project with a title and 1-sentence description. 
//              Start by saying: "Hello ${selectedStudent.name}! I'm your project assistant. Let's find a perfect project for you."`
//           : `You are a helpful project recommendation assistant for school students. 
//              The student you're talking to is ${selectedStudent.name} in class ${selectedStudent.classGrade}. 
//              Ask questions to understand their interests and suggest a personalized project. 
//              Keep responses concise (1-2 sentences max). After 3-4 exchanges, suggest a specific 
//              project with a title and 1-sentence description.`;

//       const chat = model.startChat({
//         history: messagesForApi.length > 1 ? messagesForApi.slice(0, -1) : [],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 150,
//         },
//       });

//       const result = await chat.sendMessage(`${systemInstruction}\n\n${chatInput}`);
//       const aiResponse = result.response.text();

//       if (aiResponse) {
//         setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
//         setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
//         setApiUsage((prev) => ({
//           today: prev.today + 1,
//           thisWeek: prev.thisWeek + 1,
//           lastRequest: new Date().toISOString(),
//         }));
//       }
//     } catch (error) {
//       console.error("Gemini API error:", error);
//       const localSuggestion = getLocalSuggestion(chatInput);
//       setChatMessages((prev) => [
//         ...prev,
//         { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
//       ]);
//       toast.error("Error with Gemini API");
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedStudent(null);
//     setChatMessages([]);
//     setChatInput("");
//   };

//   const StudentCard = ({ student }) => (
//     <motion.div
//       className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="p-6 flex items-start space-x-4">
//         <div className="relative">
//           {student.profilePicture && imageCache[student.profilePicture] ? (
//             <img
//               src={imageCache[student.profilePicture]}
//               alt={student.name}
//               className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=80`;
//               }}
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
//               {student.name.charAt(0)}
//             </div>
//           )}
//           <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
//             <FaUserGraduate className="w-4 h-4" />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
//           <div className="mt-1 text-sm text-gray-600">
//             <p>
//               Roll No: <span className="font-medium">{student.rollNo}</span>
//             </p>
//             <p>
//               Class: <span className="font-medium">{student.classGrade}-{student.section}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => startProjectChat(student)}
//           className="mt-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
//           title="Get Project Recommendation"
//         >
//           <FaComments className="w-5 h-5" />
//         </button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
//             <p className="mt-2 text-gray-600">Manage your class students and their information</p>
//           </div>
//           <motion.button
//             onClick={() => setIsAdding(true)}
//             className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Add New Student</span>
//           </motion.button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Classes</option>
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                 <option key={grade} value={grade}>
//                   Class {grade}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Sections</option>
//               {["A", "B", "C", "D"].map((sec) => (
//                 <option key={sec} value={sec}>
//                   Section {sec}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedClass("all");
//                 setSelectedSection("all");
//               }}
//               className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Add Student Form */}
//         <AnimatePresence>
//           {isAdding && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-8 overflow-hidden"
//             >
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
//                   <button
//                     onClick={() => setIsAdding(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <FaTimes className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleAddStudent}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={newStudent.name}
//                         onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                       <input
//                         type="text"
//                         placeholder="Enter roll number"
//                         value={newStudent.rollNo}
//                         onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
//                       <select
//                         value={newStudent.classGrade}
//                         onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Class</option>
//                         {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                           <option key={grade} value={grade}>
//                             Class {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
//                       <select
//                         value={newStudent.section}
//                         onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Section</option>
//                         {["A", "B", "C", "D"].map((sec) => (
//                           <option key={sec} value={sec}>
//                             Section {sec}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                           {newStudent.profilePicture ? (
//                             <img
//                               src={URL.createObjectURL(newStudent.profilePicture)}
//                               alt="Preview"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <FaUserGraduate className="text-gray-400 w-6 h-6" />
//                           )}
//                         </div>
//                         <label className="cursor-pointer">
//                           <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                             Choose File
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setNewStudent({ ...newStudent, profilePicture: e.target.files[0] })}
//                             className="hidden"
//                           />
//                         </label>
//                         {newStudent.profilePicture && (
//                           <button
//                             type="button"
//                             onClick={() => setNewStudent({ ...newStudent, profilePicture: null })}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-8 flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsAdding(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                     >
//                       Save Student
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Students Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 rounded-full bg-gray-200"></div>
//                   <div className="space-y-2 flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredStudents.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredStudents.map((student) => (
//               <StudentCard key={student._id} student={student} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <FaUserGraduate className="text-gray-400 w-12 h-12" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm || selectedClass !== "all" || selectedSection !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Add your first student to get started"}
//             </p>
//             <button
//               onClick={() => setIsAdding(true)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//             >
//               <FaPlus className="inline mr-2" />
//               Add Student
//             </button>
//           </div>
//         )}

//         {/* Project Recommendation Chat */}
//         <AnimatePresence>
//           {isChatOpen && selectedStudent && (
//             <motion.div
//               initial={{ opacity: 0, x: "100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "100%" }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden"
//             >
//               <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">
//                   Project Assistant for {selectedStudent.name}
//                 </h2>
//                 <button onClick={closeChat} className="text-white hover:text-indigo-200">
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                 {chatMessages.length === 0 && (
//                   <div className="text-gray-500 text-center">
//                     Start by telling me what you’re interested in (e.g., science, art, sports)!
//                   </div>
//                 )}
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-3 rounded-lg ${
//                         message.role === "teacher"
//                           ? "bg-indigo-500 text-white rounded-br-none"
//                           : "bg-gray-100 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//                 {isChatLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
//                       <div className="flex items-center space-x-2">
//                         <span>Thinking...</span>
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     disabled={isChatLoading}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                     placeholder="Type your response..."
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!chatInput.trim() || isChatLoading}
//                     className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-2 flex justify-between">
//                   <span>API calls today: {apiUsage.today}</span>
//                   {apiUsage.lastRequest && (
//                     <span>Last response: {new Date(apiUsage.lastRequest).toLocaleTimeString()}</span>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default StudentPage;

// Gemini 2.0 Flash-Lite	
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaComments } from "react-icons/fa";
// import { toast } from "sonner";
// import { useDebounce } from "use-debounce";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// const StudentPage = ({ authorizationToken }) => {
//   // Student data state
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [newStudent, setNewStudent] = useState({
//     name: "",
//     rollNo: "",
//     classGrade: "",
//     section: "",
//     profilePicture: null,
//   });

//   // UI state
//   const [isAdding, setIsAdding] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedSection, setSelectedSection] = useState("all");
//   const [imageCache, setImageCache] = useState({});

//   // Chat system state
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [lastRequestTime, setLastRequestTime] = useState(0);
//   const [conversationCache, setConversationCache] = useState({});
//   const [apiUsage, setApiUsage] = useState({
//     today: 0,
//     thisWeek: 0,
//     lastRequest: null,
//   });

//   // Local project suggestions fallback
//   const localProjectSuggestions = {
//     science: "Create a science experiment demonstrating [concept]",
//     art: "Produce an art piece exploring [theme]",
//     sports: "Develop a training program for [sport]",
//     technology: "Build a simple [technology] project",
//     math: "Design a math puzzle about [topic]",
//     history: "Create a timeline of [historical event]",
//     music: "Compose a short piece in [genre] style",
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [debouncedSearchTerm, students, selectedClass, selectedSection]);

//   const fetchStudents = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         headers: { Authorization: authorizationToken },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStudents(data);
//         await Promise.all(
//           data.map(async (student) => {
//             if (student.profilePicture) {
//               await fetchProfilePicture(student.profilePicture);
//             }
//           })
//         );
//       } else {
//         toast.error(data.message || "Failed to fetch students");
//       }
//     } catch (error) {
//       toast.error("Error fetching students");
//       console.error("Fetch students error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchProfilePicture = async (fileId) => {
//     if (imageCache[fileId]) return;
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/file/${fileId}`, {
//         headers: { Authorization: authorizationToken },
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         const imageUrl = URL.createObjectURL(blob);
//         setImageCache((prev) => ({ ...prev, [fileId]: imageUrl }));
//       }
//     } catch (error) {
//       console.error(`Error fetching image:`, error);
//     }
//   };

//   const filterStudents = () => {
//     let results = [...students];
//     if (debouncedSearchTerm) {
//       results = results.filter(
//         (student) =>
//           student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
//           student.rollNo.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
//       );
//     }
//     if (selectedClass !== "all") {
//       results = results.filter((student) => student.classGrade === selectedClass);
//     }
//     if (selectedSection !== "all") {
//       results = results.filter((student) => student.section === selectedSection);
//     }
//     setFilteredStudents(results);
//   };

//   const handleAddStudent = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     for (const key in newStudent) {
//       formData.append(key, newStudent[key]);
//     }
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/students`, {
//         method: "POST",
//         headers: { Authorization: authorizationToken },
//         body: formData,
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Student added successfully");
//         setStudents([...students, data]);
//         if (data.profilePicture) {
//           await fetchProfilePicture(data.profilePicture);
//         }
//         setNewStudent({ name: "", rollNo: "", classGrade: "", section: "", profilePicture: null });
//         setIsAdding(false);
//       } else {
//         toast.error(data.message || "Failed to add student");
//       }
//     } catch (error) {
//       toast.error("Error adding student");
//       console.error("Add student error:", error);
//     }
//   };

//   const getLocalSuggestion = (input) => {
//     const lowerInput = input.toLowerCase();
//     for (const [key, suggestion] of Object.entries(localProjectSuggestions)) {
//       if (lowerInput.includes(key)) {
//         return suggestion
//           .replace("[concept]", input.split(" ")[0])
//           .replace("[theme]", input.split(" ")[0])
//           .replace("[sport]", input.split(" ")[0])
//           .replace("[technology]", input.split(" ")[0])
//           .replace("[topic]", input.split(" ")[0])
//           .replace("[historical event]", input.split(" ")[0] + " " + (input.split(" ")[1] || ""))
//           .replace("[genre]", input.split(" ")[0]);
//       }
//     }
//     return `Create a project exploring ${input}`;
//   };

//   const startProjectChat = (student) => {
//     setSelectedStudent(student);
//     setIsChatOpen(true);
//     setChatMessages([]);
//   };

//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || isChatLoading) return;

//     const now = Date.now();
//     const timeSinceLastRequest = now - lastRequestTime;

//     const MIN_DELAY = 2000; // 2 seconds delay for 30 RPM
//     if (timeSinceLastRequest < MIN_DELAY) {
//       setChatMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: `Please wait ${((MIN_DELAY - timeSinceLastRequest) / 1000).toFixed(1)} seconds before sending another message.`,
//         },
//       ]);
//       return;
//     }

//     setLastRequestTime(now);

//     const userMessage = { role: "teacher", content: chatInput };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setIsChatLoading(true);

//     const messagesForApi = chatMessages.map((msg) => ({
//       role: msg.role === "ai" ? "model" : "user",
//       parts: [{ text: msg.content }],
//     }));

//     messagesForApi.push({ role: "user", parts: [{ text: chatInput }] });

//     const cacheKey = JSON.stringify(messagesForApi);
//     if (conversationCache[cacheKey]) {
//       setChatMessages((prev) => [...prev, { role: "ai", content: conversationCache[cacheKey] }]);
//       setIsChatLoading(false);
//       return;
//     }

//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

//       // Calculate approximate age from classGrade (Class 1 ≈ 6 years, Class 12 ≈ 17 years)
//       const studentAge = parseInt(selectedStudent.classGrade) + 5;

//       const exchangeCount = messagesForApi.filter((msg) => msg.role === "user").length;

//       const systemInstruction = `
//         You are a project prediction assistant for school students.
//         The student is ${selectedStudent.name}, approximately ${studentAge} years old, in class ${selectedStudent.classGrade}.
//         Your goal is to predict a personalized project based on their age, hobbies, and interests within 5-8 exchanges.
//         Keep responses concise (1-2 sentences max).
//         Start with: "Hello ${selectedStudent.name}! What do you enjoy doing in your free time?"
//         After each response, ask a follow-up question to gather more info (e.g., "What kind of [interest] do you like?").
//         By exchanges 5-8, predict a project with a title and 1-sentence description (e.g., "Project: Solar System Model - Build a model of the solar system using everyday materials.").
//         Current exchange count: ${exchangeCount}.
//       `;

//       const chat = model.startChat({
//         history: messagesForApi.length > 1 ? messagesForApi.slice(0, -1) : [],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 150,
//         },
//       });

//       const result = await chat.sendMessage(`${systemInstruction}\n\n${chatInput}`);
//       const aiResponse = result.response.text();

//       if (aiResponse) {
//         setConversationCache((prev) => ({ ...prev, [cacheKey]: aiResponse }));
//         setChatMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
//         setApiUsage((prev) => ({
//           today: prev.today + 1,
//           thisWeek: prev.thisWeek + 1,
//           lastRequest: new Date().toISOString(),
//         }));
//       }
//     } catch (error) {
//       console.error("Gemini API error:", error);
//       const localSuggestion = getLocalSuggestion(chatInput);
//       setChatMessages((prev) => [
//         ...prev,
//         { role: "ai", content: `Having trouble connecting to Gemini. Try this: ${localSuggestion}` },
//       ]);
//       toast.error("Error with Gemini API");
//     } finally {
//       setIsChatLoading(false);
//     }
//   };

//   const closeChat = () => {
//     setIsChatOpen(false);
//     setSelectedStudent(null);
//     setChatMessages([]);
//     setChatInput("");
//   };

//   const StudentCard = ({ student }) => (
//     <motion.div
//       className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="p-6 flex items-start space-x-4">
//         <div className="relative">
//           {student.profilePicture && imageCache[student.profilePicture] ? (
//             <img
//               src={imageCache[student.profilePicture]}
//               alt={student.name}
//               className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${student.name}&background=random&size=80`;
//               }}
//             />
//           ) : (
//             <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
//               {student.name.charAt(0)}
//             </div>
//           )}
//           <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
//             <FaUserGraduate className="w-4 h-4" />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
//           <div className="mt-1 text-sm text-gray-600">
//             <p>
//               Roll No: <span className="font-medium">{student.rollNo}</span>
//             </p>
//             <p>
//               Class: <span className="font-medium">{student.classGrade}-{student.section}</span>
//             </p>
//           </div>
//         </div>
//         <button
//           onClick={() => startProjectChat(student)}
//           className="mt-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
//           title="Get Project Recommendation"
//         >
//           <FaComments className="w-5 h-5" />
//         </button>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
//             <p className="mt-2 text-gray-600">Manage your class students and their information</p>
//           </div>
//           <motion.button
//             onClick={() => setIsAdding(true)}
//             className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaPlus className="w-4 h-4" />
//             <span>Add New Student</span>
//           </motion.button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Classes</option>
//               {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                 <option key={grade} value={grade}>
//                   Class {grade}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             >
//               <option value="all">All Sections</option>
//               {["A", "B", "C", "D"].map((sec) => (
//                 <option key={sec} value={sec}>
//                   Section {sec}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setSelectedClass("all");
//                 setSelectedSection("all");
//               }}
//               className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>

//         {/* Add Student Form */}
//         <AnimatePresence>
//           {isAdding && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-8 overflow-hidden"
//             >
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-semibold text-gray-800">Add New Student</h3>
//                   <button
//                     onClick={() => setIsAdding(false)}
//                     className="text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     <FaTimes className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleAddStudent}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={newStudent.name}
//                         onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                       <input
//                         type="text"
//                         placeholder="Enter roll number"
//                         value={newStudent.rollNo}
//                         onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
//                       <select
//                         value={newStudent.classGrade}
//                         onChange={(e) => setNewStudent({ ...newStudent, classGrade: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Class</option>
//                         {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((grade) => (
//                           <option key={grade} value={grade}>
//                             Class {grade}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
//                       <select
//                         value={newStudent.section}
//                         onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         required
//                       >
//                         <option value="">Select Section</option>
//                         {["A", "B", "C", "D"].map((sec) => (
//                           <option key={sec} value={sec}>
//                             Section {sec}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
//                       <div className="flex items-center space-x-4">
//                         <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                           {newStudent.profilePicture ? (
//                             <img
//                               src={URL.createObjectURL(newStudent.profilePicture)}
//                               alt="Preview"
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <FaUserGraduate className="text-gray-400 w-6 h-6" />
//                           )}
//                         </div>
//                         <label className="cursor-pointer">
//                           <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                             Choose File
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setNewStudent({ ...newStudent, profilePicture: e.target.files[0] })}
//                             className="hidden"
//                           />
//                         </label>
//                         {newStudent.profilePicture && (
//                           <button
//                             type="button"
//                             onClick={() => setNewStudent({ ...newStudent, profilePicture: null })}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-8 flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsAdding(false)}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                     >
//                       Save Student
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Students Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-16 h-16 rounded-full bg-gray-200"></div>
//                   <div className="space-y-2 flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredStudents.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredStudents.map((student) => (
//               <StudentCard key={student._id} student={student} />
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <FaUserGraduate className="text-gray-400 w-12 h-12" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm || selectedClass !== "all" || selectedSection !== "all"
//                 ? "Try adjusting your search or filters"
//                 : "Add your first student to get started"}
//             </p>
//             <button
//               onClick={() => setIsAdding(true)}
//               className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//             >
//               <FaPlus className="inline mr-2" />
//               Add Student
//             </button>
//           </div>
//         )}

//         {/* Project Recommendation Chat */}
//         <AnimatePresence>
//           {isChatOpen && selectedStudent && (
//             <motion.div
//               initial={{ opacity: 0, x: "100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "100%" }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden"
//             >
//               <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
//                 <h2 className="text-lg font-semibold">
//                   Project Assistant for {selectedStudent.name}
//                 </h2>
//                 <button onClick={closeChat} className="text-white hover:text-indigo-200">
//                   <FaTimes className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="flex-1 p-4 overflow-y-auto space-y-4">
//                 {chatMessages.length === 0 && (
//                   <div className="text-gray-500 text-center">
//                     Let’s find a project for you—start by telling me what you like!
//                   </div>
//                 )}
//                 {chatMessages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[80%] p-3 rounded-lg ${
//                         message.role === "teacher"
//                           ? "bg-indigo-500 text-white rounded-br-none"
//                           : "bg-gray-100 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       {message.content}
//                     </div>
//                   </div>
//                 ))}
//                 {isChatLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
//                       <div className="flex items-center space-x-2">
//                         <span>Thinking...</span>
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
//                           <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t border-gray-200">
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     disabled={isChatLoading}
//                     className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
//                     placeholder="Type your response..."
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!chatInput.trim() || isChatLoading}
//                     className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
//                   >
//                     Send
//                   </button>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-2 flex justify-between">
//                   <span>API calls today: {apiUsage.today}</span>
//                   {apiUsage.lastRequest && (
//                     <span>Last response: {new Date(apiUsage.lastRequest).toLocaleTimeString()}</span>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default StudentPage;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaSearch, FaUserGraduate, FaTimes, FaComments } from "react-icons/fa";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

const StudentPage = ({ authorizationToken }) => {
  // Student data state
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    rollNo: "",
    classGrade: "",
    section: "",
    profilePicture: null,
  });

  // UI state
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [imageCache, setImageCache] = useState({});

  // Chat system state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [conversationCache, setConversationCache] = useState({});
  const [apiUsage, setApiUsage] = useState({
    today: 0,
    thisWeek: 0,
    lastRequest: null,
  });

  // Local project suggestions fallback
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
          await fetchProfilePicture(data.profilePicture);
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
    setChatMessages([]); // Start with an empty chat
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    const MIN_DELAY = 2000; // 2 seconds delay for 30 RPM
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

      // Filter history to exclude the initial AI message if it exists, ensuring user-first
      const chatHistory = messagesForApi.filter((msg, index) => {
        if (exchangeCount === 1) return false; // No history for first message
        return index > 0 || msg.role === "user"; // Skip initial model message if present
      });

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
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
            <p>
              Roll No: <span className="font-medium">{student.rollNo}</span>
            </p>
            <p>
              Class: <span className="font-medium">{student.classGrade}-{student.section}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => startProjectChat(student)}
          className="mt-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          title="Get Project Recommendation"
        >
          <FaComments className="w-5 h-5" />
        </button>
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

        {/* Project Recommendation Chat */}
        <AnimatePresence>
          {isChatOpen && selectedStudent && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 md:inset-auto md:top-4 md:right-4 md:bottom-4 md:w-96 bg-white shadow-xl rounded-lg flex flex-col z-50 overflow-hidden"
            >
              <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Project Assistant for {selectedStudent.name}
                </h2>
                <button onClick={closeChat} className="text-white hover:text-indigo-200">
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-gray-500 text-center">
                    Let’s find a project for you—start by telling me what you like!
                  </div>
                )}
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "teacher" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "teacher"
                          ? "bg-indigo-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <span>Thinking...</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isChatLoading}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    placeholder="Type your response..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                  >
                    Send
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex justify-between">
                  <span>API calls today: {apiUsage.today}</span>
                  {apiUsage.lastRequest && (
                    <span>Last response: {new Date(apiUsage.lastRequest).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentPage;