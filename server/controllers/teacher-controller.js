// const mongoose = require("mongoose");
// const Teacher = require("../models/teacher-model");
// const Student = require("../models/student-model");
// const { Readable } = require("stream");
// const { registerSchema } = require("../validators/teacher-validator");
// const { sendEmail } = require("../utils/email");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const XLSX = require("xlsx");


// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const generatePassword = () => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let password = "";
//   for (let i = 0; i < 8; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// };

// const registerTeacher = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         require("../middlewares/multer-config").imageUpload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Teacher profile picture uploaded:", req.file ? req.file.originalname : "No file");
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error("File upload failed:", error.message);
//       res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       console.log("Incoming registration data:", JSON.stringify(req.body, null, 2));

//       const validatedData = await registerSchema.parseAsync(req.body);
//       const { email } = validatedData;

//       const existingTeacher = await Teacher.findOne({ $or: [{ email }, { username: validatedData.username }] });
//       if (existingTeacher) {
//         console.log(`Duplicate found: ${email} or ${validatedData.username}`);
//         return res.status(400).json({ status: 400, message: "Email or username already registered", extraDetails: "" });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
//       let profilePictureId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on("error", (err) => reject(err))
//             .on("finish", () => resolve());
//         });
//         console.log("Profile picture uploaded with ID:", profilePictureId);
//       }

//       const otp = generateOTP();
//       await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);
//       console.log(`OTP sent to ${email}: ${otp}`);

//       const tempTeacher = {
//         ...validatedData,
//         profilePicture: profilePictureId,
//         otp,
//         expiresAt: Date.now() + 10 * 60 * 1000,
//       };

//       req.app.locals.tempTeachers = req.app.locals.tempTeachers || {};
//       req.app.locals.tempTeachers[email] = tempTeacher;
//       console.log("Stored tempTeacher:", JSON.stringify(tempTeacher, null, 2));

//       res.status(200).json({ status: 200, message: "OTP sent to your email. Please verify.", extraDetails: "" });
//     } catch (error) {
//       if (error.name === "ZodError") {
//         const status = 422;
//         const message = "Validation failed";
//         const extraDetails = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
//         console.error(`[${status}] ${message}: ${extraDetails}`);
//         return res.status(status).json({ status, message, extraDetails });
//       }
//       next(error);
//     }
//   },
// ];

// const verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     const tempTeachers = req.app.locals.tempTeachers || {};
//     const tempTeacher = tempTeachers[email];

//     if (!tempTeacher || tempTeacher.otp !== otp || Date.now() > tempTeacher.expiresAt) {
//       console.log(`Invalid OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
//     }

//     const teacher = new Teacher({
//       teacherName: tempTeacher.teacherName,
//       username: tempTeacher.username,
//       email: tempTeacher.email,
//       password: tempTeacher.password,
//       phoneNumber: tempTeacher.phoneNumber,
//       profilePicture: tempTeacher.profilePicture,
//       subject: tempTeacher.subject,
//       classGrade: tempTeacher.classGrade,
//       section: tempTeacher.section,
//     });
//     await teacher.save();

//     const token = teacher.generateToken();
//     delete req.app.locals.tempTeachers[email];
//     console.log(`Teacher registered: ${email}, Token: ${token}`);

//     res.status(201).json({ status: 201, message: "Teacher registered successfully", token });
//   } catch (error) {
//     next(error);
//   }
// };

// const loginTeacher = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const teacher = await Teacher.findOne({ email });
//     if (!teacher || !(await teacher.comparePassword(password))) {
//       console.log(`Login failed for ${email}`);
//       return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
//     }
//     const token = teacher.generateToken();
//     console.log(`Login successful for ${email}, Token: ${token}`);
//     res.json({ status: 200, message: "Login successful", token });
//   } catch (error) {
//     next(error);
//   }
// };

// const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) {
//       console.log(`Email not found: ${email}`);
//       return res.status(404).json({ status: 404, message: "Email not found", extraDetails: "" });
//     }

//     const otp = generateOTP();
//     await sendEmail(email, "Password Reset OTP", `Your OTP to reset your password is: ${otp}`);
//     console.log(`Reset OTP sent to ${email}: ${otp}`);

//     req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
//     req.app.locals.resetOTPs[email] = {
//       otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//     };

//     res.status(200).json({ status: 200, message: "OTP sent to your email for password reset.", extraDetails: "" });
//   } catch (error) {
//     next(error);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     const resetOTPs = req.app.locals.resetOTPs || {};
//     const resetData = resetOTPs[email];

//     if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
//       console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
//       return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
//     }

//     const teacher = await Teacher.findOne({ email });
//     if (!teacher) {
//       console.log(`Teacher not found for reset: ${email}`);
//       return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
//     }

//     teacher.password = newPassword;
//     await teacher.save();
//     delete req.app.locals.resetOTPs[email];
//     console.log(`Password reset successful for ${email}`);

//     res.status(200).json({ status: 200, message: "Password reset successfully", extraDetails: "" });
//   } catch (error) {
//     next(error);
//   }
// };

// const getProfile = async (req, res, next) => {
//   try {
//     const teacher = await Teacher.findById(req.user.userId).select("-password");
//     if (!teacher) {
//       console.log(`Profile not found for userId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
//     }
//     console.log("Fetched profile data:", JSON.stringify(teacher.toObject(), null, 2));
//     res.json(teacher);
//   } catch (error) {
//     next(error);
//   }
// };

// const getFile = async (req, res, next) => {
//   try {
//     const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
//     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
//     const files = await gfs.find({ _id: fileId }).toArray();

//     if (!files || files.length === 0) {
//       console.log(`File not found for ID: ${fileId}`);
//       return res.status(404).json({ status: 404, message: "File not found", extraDetails: "" });
//     }

//     const file = files[0];
//     console.log(`Serving file: ${file.filename}, ID: ${fileId}`);
//     res.set("Content-Type", file.contentType || "application/octet-stream");
//     res.set("Content-Disposition", `inline; filename="${file.filename}"`);
//     gfs.openDownloadStream(fileId).pipe(res).on("error", (err) => {
//       console.error(`Error streaming file ${fileId}:`, err);
//       res.status(500).end();
//     });
//   } catch (error) {
//     console.error("Error in getFile:", error);
//     next(error);
//   }
// };

// const updateProfile = async (req, res, next) => {
//   try {
//     const { teacherName, email, phoneNumber, subject, classGrade, section } = req.body;
//     const teacher = await Teacher.findById(req.user.userId);

//     if (!teacher) {
//       console.log(`Teacher not found for update: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
//     }

//     teacher.teacherName = teacherName || teacher.teacherName;
//     teacher.email = email || teacher.email;
//     teacher.phoneNumber = phoneNumber || teacher.phoneNumber;
//     teacher.subject = subject || teacher.subject;
//     teacher.classGrade = classGrade || teacher.classGrade;
//     teacher.section = section || teacher.section;

//     await teacher.save();
//     console.log(`Profile updated for ${teacher.email}`);
//     res.status(200).json({ status: 200, message: "Profile updated successfully", data: teacher });
//   } catch (error) {
//     next(error);
//   }
// };

// const addStudent = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         require("../middlewares/multer-config").imageUpload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Student profile picture uploaded:", req.file ? req.file.originalname : "No file");
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error("File upload failed:", error.message);
//       res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const { name, rollNo, classGrade, section, phoneNumber, email } = req.body;
//       const teacherId = req.user.userId;

//       const existingStudent = await Student.findOne({ $or: [{ rollNo }, { email }] });
//       if (existingStudent) {
//         return res.status(400).json({ status: 400, message: "Roll number or email already exists", extraDetails: "" });
//       }

//       const phoneRegex = /^\+?\d{10,15}$/;
//       if (!phoneRegex.test(phoneNumber)) {
//         return res.status(400).json({ message: "Invalid phone number format (e.g., +1234567890 or 1234567890)" });
//       }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({ message: "Invalid email format" });
//       }
//       if (!["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(classGrade)) {
//         return res.status(400).json({ message: "Invalid class (must be 1-12)" });
//       }
//       if (!["A", "B", "C", "D"].includes(section)) {
//         return res.status(400).json({ message: "Invalid section (must be A, B, C, or D)" });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
//       let profilePictureId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on("error", (err) => reject(err))
//             .on("finish", () => {
//               console.log(`Student profile picture saved with ID: ${profilePictureId}`);
//               resolve();
//             });
//         });

//         // Verify file exists
//         const fileExists = await gfs.find({ _id: profilePictureId }).hasNext();
//         if (!fileExists) {
//           throw new Error("Failed to save profile picture");
//         }
//       }

//       const rawPassword = generatePassword();
//       const hashedPassword = await bcrypt.hash(rawPassword, 10);

//       const student = new Student({
//         name,
//         rollNo,
//         classGrade,
//         section,
//         phoneNumber,
//         email,
//         password: hashedPassword,
//         rawPassword,
//         profilePicture: profilePictureId,
//         teacher: teacherId,
//         project: { title: "", description: "" },
//         submittedPhotos: [],
//       });

//       await student.save();

//       await sendEmail(
//         email,
//         "Your Student Account Credentials",
//         `Dear ${name},\n\nYour student account has been created.\n\nLogin Details:\nRoll No: ${rollNo}\nPassword: ${rawPassword}\n\nPlease log in at ${process.env.FRONTEND_URL}/student-login and change your password after logging in.\n\nBest regards,\nEducationForAll Team`
//       );

//       console.log(`Student added: ${name}, Profile Picture ID: ${profilePictureId || "None"}, Password sent to ${email}`);
//       res.status(201).json(student);
//     } catch (error) {
//       console.error("Error adding student:", error);
//       next(error);
//     }
//   },
// ];

// const getStudents = async (req, res, next) => {
//   try {
//     const teacherId = req.user.userId;
//     const students = await Student.find({ teacher: teacherId }).select("+rawPassword");
//     console.log(`Fetched ${students.length} students for teacher ${teacherId}`);

//     // Clean up invalid file references
//     for (const student of students) {
//       if (student.profilePicture) {
//         const fileExists = await gfs.find({ _id: new mongoose.Types.ObjectId(student.profilePicture) }).hasNext();
//         if (!fileExists) {
//           console.log(`Invalid profile picture ID ${student.profilePicture} for student ${student.name}`);
//           student.profilePicture = null;
//           await student.save();
//         }
//       }
//       if (student.submittedPhotos && student.submittedPhotos.length > 0) {
//         const validPhotos = [];
//         for (const photoId of student.submittedPhotos) {
//           const fileExists = await gfs.find({ _id: new mongoose.Types.ObjectId(photoId) }).hasNext();
//           if (fileExists) {
//             validPhotos.push(photoId);
//           } else {
//             console.log(`Invalid submitted photo ID ${photoId} for student ${student.name}`);
//           }
//         }
//         if (validPhotos.length !== student.submittedPhotos.length) {
//           student.submittedPhotos = validPhotos;
//           await student.save();
//         }
//       }
//     }

//     res.json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     next(error);
//   }
// };

// const updateStudentProject = async (req, res, next) => {
//   try {
//     const { studentId, projectTitle, projectDescription } = req.body;
//     const teacherId = req.user.userId;

//     const student = await Student.findOne({ _id: studentId, teacher: teacherId });
//     if (!student) {
//       return res.status(404).json({ status: 404, message: "Student not found or not assigned to you", extraDetails: "" });
//     }

//     student.project = {
//       title: projectTitle,
//       description: projectDescription,
//     };
//     await student.save();

//     await sendEmail(
//       student.email,
//       "Project Assignment Notification",
//       `Dear ${student.name},\n\nA new project has been assigned to you:\n\nTitle: ${projectTitle}\nDescription: ${projectDescription}\n\nPlease submit your project photos via the student dashboard.\n\nBest regards,\nEducationForAll Team`
//     );

//     console.log(`Project updated and email notification sent for student ${student.name}: ${projectTitle}`);
//     res.status(200).json({ status: 200, message: "Project updated successfully", data: student });
//   } catch (error) {
//     console.error("Error updating student project:", error);
//     next(error);
//   }
// };

// const studentLogin = async (req, res, next) => {
//   try {
//     const { rollNo, password } = req.body;
//     const student = await Student.findOne({ rollNo });
//     if (!student || !(await bcrypt.compare(password, student.password))) {
//       console.log(`Login failed for rollNo: ${rollNo}`);
//       return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
//     }
//     const token = jwt.sign(
//       { userId: student._id, role: "student" },
//       process.env.JWT_KEY,
//       { expiresIn: "24h" }
//     );
//     console.log(`Login successful for rollNo: ${rollNo}, Token: ${token}`);
//     res.json({ status: 200, message: "Login successful", token });
//   } catch (error) {
//     console.error("Student login error:", error);
//     next(error);
//   }
// };

// const getStudentProfile = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.user.userId).select("-password");
//     if (!student) {
//       console.log(`Profile not found for studentId: ${req.user.userId}`);
//       return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
//     }
//     console.log("Fetched student profile:", student);
//     res.json(student);
//   } catch (error) {
//     console.error("Error fetching student profile:", error);
//     next(error);
//   }
// };

// const uploadStudentPhoto = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         require("../middlewares/multer-config").imageUpload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Student project photo uploaded:", req.file ? req.file.originalname : "No file");
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error("File upload failed:", error.message);
//       res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const studentId = req.user.userId;
//       const student = await Student.findById(studentId);
//       if (!student) {
//         return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
//       }

//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
//       let photoId = null;

//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         photoId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on("error", (err) => reject(err))
//             .on("finish", () => {
//               console.log(`Project photo saved with ID: ${photoId}`);
//               resolve();
//             });
//         });

//         // Verify file exists
//         const fileExists = await gfs.find({ _id: photoId }).hasNext();
//         if (!fileExists) {
//           throw new Error("Failed to save project photo");
//         }

//         student.submittedPhotos = student.submittedPhotos || [];
//         student.submittedPhotos.push(photoId);
//         await student.save();

//         const teacher = await Teacher.findById(student.teacher);
//         if (teacher) {
//           await sendEmail(
//             teacher.email,
//             "Student Project Submission",
//             `Dear ${teacher.teacherName},\n\n${student.name} (Roll No: ${student.rollNo}) has submitted a project photo for the project "${student.project.title}".\n\nPlease review it in the teacher dashboard.\n\nBest regards,\nEducationForAll Team`
//           );
//         }
//       }

//       console.log(`Photo uploaded for student ${student.name}, Photo ID: ${photoId}`);
//       res.status(200).json({ status: 200, message: "Photo uploaded successfully", photoId });
//     } catch (error) {
//       console.error("Error uploading student photo:", error);
//       next(error);
//     }
//   },
// ];

// const bulkAddStudents = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         require("../middlewares/multer-config").excelUpload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Excel file uploaded:", req.file ? req.file.originalname : "No file");
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error("Excel upload failed:", error.message);
//       res.status(400).json({ status: 400, message: "Excel upload failed", extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const teacherId = req.user.userId;
//       if (!req.file) {
//         return res.status(400).json({ status: 400, message: "No Excel file uploaded", extraDetails: "" });
//       }

//       const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const studentsData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       // Validate headers
//       const headers = studentsData[0].map((h) => h.toString().toLowerCase().trim().replace(/\s+/g, ""));
//       const requiredHeaders = ["name", "rollno", "class", "section", "phonenumber", "email"];
//       const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
//       if (missingHeaders.length > 0) {
//         return res.status(400).json({
//           status: 400,
//           message: `Missing required headers: ${missingHeaders.join(", ")}`,
//           extraDetails: "",
//         });
//       }

//       const students = [];
//       const errors = [];
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const phoneRegex = /^\+?\d{10,15}$/;

//       // Process rows (skip header)
//       for (let i = 1; i < studentsData.length; i++) {
//         const row = studentsData[i];
//         const student = {
//           name: row[headers.indexOf("name")]?.toString().trim(),
//           rollNo: row[headers.indexOf("rollno")]?.toString().trim(),
//           classGrade: row[headers.indexOf("class")]?.toString().trim(),
//           section: row[headers.indexOf("section")]?.toString().trim().toUpperCase(),
//           phoneNumber: row[headers.indexOf("phonenumber")]?.toString().trim(),
//           email: row[headers.indexOf("email")]?.toString().trim().toLowerCase(),
//         };

//         // Validate data
//         if (!student.name || !student.rollNo || !student.classGrade || !student.section || !student.phoneNumber || !student.email) {
//           errors.push(`Row ${i + 1}: Missing required fields`);
//           continue;
//         }
//         if (!["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(student.classGrade)) {
//           errors.push(`Row ${i + 1}: Invalid class (must be 1-12)`);
//           continue;
//         }
//         if (!["A", "B", "C", "D"].includes(student.section)) {
//           errors.push(`Row ${i + 1}: Invalid section (must be A, B, C, or D)`);
//           continue;
//         }
//         if (!phoneRegex.test(student.phoneNumber)) {
//           errors.push(`Row ${i + 1}: Invalid phone number format`);
//           continue;
//         }
//         if (!emailRegex.test(student.email)) {
//           errors.push(`Row ${i + 1}: Invalid email format`);
//           continue;
//         }

//         // Check for duplicates
//         const existingStudent = await Student.findOne({ $or: [{ rollNo: student.rollNo }, { email: student.email }] });
//         if (existingStudent) {
//           errors.push(`Row ${i + 1}: Roll number or email already exists`);
//           continue;
//         }

//         students.push(student);
//       }

//       if (errors.length > 0) {
//         return res.status(400).json({
//           status: 400,
//           message: "Validation errors in Excel data",
//           extraDetails: errors.join("; "),
//         });
//       }

//       const createdStudents = [];
//       for (const studentData of students) {
//         const rawPassword = generatePassword();
//         const hashedPassword = await bcrypt.hash(rawPassword, 10);

//         const student = new Student({
//           name: studentData.name,
//           rollNo: studentData.rollNo,
//           classGrade: studentData.classGrade,
//           section: studentData.section,
//           phoneNumber: studentData.phoneNumber,
//           email: studentData.email,
//           password: hashedPassword,
//           rawPassword,
//           profilePicture: null,
//           teacher: teacherId,
//           project: { title: "", description: "" },
//           submittedPhotos: [],
//         });

//         await student.save();

//         await sendEmail(
//           studentData.email,
//           "Your Student Account Credentials",
//           `Dear ${studentData.name},\n\nYour student account has been created.\n\nLogin Details:\nRoll No: ${studentData.rollNo}\nPassword: ${rawPassword}\n\nPlease log in at ${process.env.FRONTEND_URL}/student-login and change your password after logging in.\n\nBest regards,\nEducationForAll Team`
//         );

//         console.log(`Student added via bulk upload: ${studentData.name}, Password sent to ${studentData.email}`);
//         createdStudents.push(student);
//       }

//       res.status(201).json({
//         status: 201,
//         message: `${createdStudents.length} students added successfully`,
//         data: createdStudents,
//       });
//     } catch (error) {
//       console.error("Error in bulk student upload:", error);
//       next(error);
//     }
//   },
// ];

// const getStudentDetails = async (req, res, next) => {
//   try {
//     const studentId = req.params.studentId;
//     const teacherId = req.user.userId;
//     const student = await Student.findOne({ _id: studentId, teacher: teacherId }).select("+rawPassword");
//     if (!student) {
//       return res.status(404).json({ status: 404, message: "Student not found or not assigned to you", extraDetails: "" });
//     }
//     console.log(`Fetched details for student ${student.name}`);
//     res.json(student);
//   } catch (error) {
//     console.error("Error fetching student details:", error);
//     next(error);
//   }
// };

// const updateStudent = [
//   async (req, res, next) => {
//     try {
//       await new Promise((resolve, reject) => {
//         require("../middlewares/multer-config").imageUpload(req, res, (err) => {
//           if (err instanceof multer.MulterError) {
//             return reject(new Error(`Multer error: ${err.message}`));
//           } else if (err) {
//             return reject(new Error(`Upload error: ${err.message}`));
//           }
//           console.log("Student profile picture updated:", req.file ? req.file.originalname : "No file");
//           resolve();
//         });
//       });
//       next();
//     } catch (error) {
//       console.error("File upload failed:", error.message);
//       res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
//     }
//   },
//   async (req, res, next) => {
//     try {
//       const studentId = req.params.studentId;
//       const teacherId = req.user.userId;
//       const { name, rollNo, classGrade, section, phoneNumber, email, password } = req.body;

//       const student = await Student.findOne({ _id: studentId, teacher: teacherId });
//       if (!student) {
//         return res.status(404).json({ status: 404, message: "Student not found or not assigned to you", extraDetails: "" });
//       }

//       // Validate inputs
//       const phoneRegex = /^\+?\d{10,15}$/;
//       if (phoneNumber && !phoneRegex.test(phoneNumber)) {
//         return res.status(400).json({ message: "Invalid phone number format (e.g., +1234567890 or 1234567890)" });
//       }
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (email && !emailRegex.test(email)) {
//         return res.status(400).json({ message: "Invalid email format" });
//       }
//       if (classGrade && !["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].includes(classGrade)) {
//         return res.status(400).json({ message: "Invalid class (must be 1-12)" });
//       }
//       if (section && !["A", "B", "C", "D"].includes(section)) {
//         return res.status(400).json({ message: "Invalid section (must be A, B, C, or D)" });
//       }

//       // Check for duplicate rollNo or email
//       if (rollNo && rollNo !== student.rollNo) {
//         const existingRollNo = await Student.findOne({ rollNo, _id: { $ne: studentId } });
//         if (existingRollNo) {
//           return res.status(400).json({ status: 400, message: "Roll number already exists", extraDetails: "" });
//         }
//       }
//       if (email && email !== student.email) {
//         const existingEmail = await Student.findOne({ email, _id: { $ne: studentId } });
//         if (existingEmail) {
//           return res.status(400).json({ status: 400, message: "Email already exists", extraDetails: "" });
//         }
//       }

//       // Update fields
//       student.name = name || student.name;
//       student.rollNo = rollNo || student.rollNo;
//       student.classGrade = classGrade || student.classGrade;
//       student.section = section || student.section;
//       student.phoneNumber = phoneNumber || student.phoneNumber;
//       student.email = email || student.email;

//       // Handle password update
//       if (password) {
//         const rawPassword = password;
//         student.password = await bcrypt.hash(rawPassword, 10);
//         student.rawPassword = rawPassword;

//         await sendEmail(
//           student.email,
//           "Your Student Account Password Updated",
//           `Dear ${student.name},\n\nYour student account password has been updated.\n\nLogin Details:\nRoll No: ${student.rollNo}\nNew Password: ${rawPassword}\n\nPlease log in at ${process.env.FRONTEND_URL}/student-login and change your password if needed.\n\nBest regards,\nEducationForAll Team`
//         );
//       }

//       // Handle profile picture
//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
//       if (req.file) {
//         const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
//         const bufferStream = Readable.from(req.file.buffer);
//         const profilePictureId = uploadStream.id;

//         await new Promise((resolve, reject) => {
//           bufferStream
//             .pipe(uploadStream)
//             .on("error", (err) => reject(err))
//             .on("finish", () => {
//               console.log(`Student profile picture updated with ID: ${profilePictureId}`);
//               resolve();
//             });
//         });

//         // Verify file exists
//         const fileExists = await gfs.find({ _id: profilePictureId }).hasNext();
//         if (!fileExists) {
//           throw new Error("Failed to save profile picture");
//         }

//         // Delete old profile picture
//         if (student.profilePicture) {
//           await gfs.delete(new mongoose.Types.ObjectId(student.profilePicture)).catch((err) => console.error("Error deleting old profile picture:", err));
//         }
//         student.profilePicture = profilePictureId;
//       }

//       await student.save();
//       console.log(`Student updated: ${student.name}`);
//       res.status(200).json({ status: 200, message: "Student updated successfully", data: student });
//     } catch (error) {
//       console.error("Error updating student:", error);
//       next(error);
//     }
//   },
// ];

// module.exports = {
//   registerTeacher,
//   verifyOTP,
//   loginTeacher,
//   forgotPassword,
//   resetPassword,
//   getProfile,
//   getFile,
//   updateProfile,
//   addStudent,
//   getStudents,
//   updateStudentProject,
//   studentLogin,
//   getStudentProfile,
//   uploadStudentPhoto,
//   bulkAddStudents,
//   getStudentDetails,
//   updateStudent,
// };

const mongoose = require("mongoose");
const Teacher = require("../models/teacher-model");
const Student = require("../models/student-model");
const multer = require("multer");
const { Readable } = require("stream");
const { registerSchema } = require("../validators/teacher-validator");
const { sendEmail } = require("../utils/email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("profilePicture");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const registerTeacher = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Uploaded file:", req.file ? req.file.originalname : "None");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      console.log("Incoming registration data:", JSON.stringify(req.body, null, 2));

      const validatedData = await registerSchema.parseAsync(req.body);
      const { email } = validatedData;

      const existingTeacher = await Teacher.findOne({ $or: [{ email }, { username: validatedData.username }] });
      if (existingTeacher) {
        console.log(`Duplicate found: ${email} or ${validatedData.username}`);
        return res.status(400).json({ status: 400, message: "Email or username already registered", extraDetails: "" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => resolve());
        });
        console.log("Profile picture uploaded with ID:", profilePictureId);
      }

      const otp = generateOTP();
      await sendEmail(email, "Verify Your Email", `Your OTP for registration is: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);

      const tempTeacher = {
        ...validatedData,
        profilePicture: profilePictureId,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      req.app.locals.tempTeachers = req.app.locals.tempTeachers || {};
      req.app.locals.tempTeachers[email] = tempTeacher;
      console.log("Stored tempTeacher:", JSON.stringify(tempTeacher, null, 2));

      res.status(200).json({ status: 200, message: "OTP sent to your email. Please verify.", extraDetails: "" });
    } catch (error) {
      if (error.name === "ZodError") {
        const status = 422;
        const message = "Validation failed";
        const extraDetails = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        console.error(`[${status}] ${message}: ${extraDetails}`);
        return res.status(status).json({ status, message, extraDetails });
      }
      next(error);
    }
  },
];

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const tempTeachers = req.app.locals.tempTeachers || {};
    const tempTeacher = tempTeachers[email];

    if (!tempTeacher || tempTeacher.otp !== otp || Date.now() > tempTeacher.expiresAt) {
      console.log(`Invalid OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const teacher = new Teacher({
      teacherName: tempTeacher.teacherName,
      username: tempTeacher.username,
      email: tempTeacher.email,
      password: tempTeacher.password,
      phoneNumber: tempTeacher.phoneNumber,
      profilePicture: tempTeacher.profilePicture,
      subject: tempTeacher.subject,
      classGrade: tempTeacher.classGrade,
      section: tempTeacher.section,
    });
    await teacher.save();
    const token = teacher.generateToken();

    delete req.app.locals.tempTeachers[email];
    console.log(`Teacher registered: ${email}, Token: ${token}`);

    res.status(201).json({ status: 201, message: "Teacher registered successfully", token });
  } catch (error) {
    next(error);
  }
};

const loginTeacher = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher || !(await teacher.comparePassword(password))) {
      console.log(`Login failed for ${email}`);
      return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
    }
    const token = teacher.generateToken();
    console.log(`Login successful for ${email}, Token: ${token}`);
    res.json({ status: 200, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      console.log(`Email not found: ${email}`);
      return res.status(404).json({ status: 404, message: "Email not found", extraDetails: "" });
    }

    const otp = generateOTP();
    await sendEmail(email, "Password Reset OTP", `Your OTP to reset your password is: ${otp}`);
    console.log(`Reset OTP sent to ${email}: ${otp}`);

    req.app.locals.resetOTPs = req.app.locals.resetOTPs || {};
    req.app.locals.resetOTPs[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ status: 200, message: "OTP sent to your email for password reset.", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const resetOTPs = req.app.locals.resetOTPs || {};
    const resetData = resetOTPs[email];

    if (!resetData || resetData.otp !== otp || Date.now() > resetData.expiresAt) {
      console.log(`Invalid reset OTP attempt for ${email}: ${otp}`);
      return res.status(400).json({ status: 400, message: "Invalid or expired OTP", extraDetails: "" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      console.log(`Teacher not found for reset: ${email}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }

    teacher.password = newPassword;
    await teacher.save();
    delete req.app.locals.resetOTPs[email];
    console.log(`Password reset successful for ${email}`);

    res.status(200).json({ status: 200, message: "Password reset successfully", extraDetails: "" });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.userId).select("-password");
    if (!teacher) {
      console.log(`Profile not found for userId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }
    console.log("Fetched profile data:", JSON.stringify(teacher.toObject(), null, 2));
    res.json(teacher);
  } catch (error) {
    next(error);
  }
};

const getFile = async (req, res, next) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await gfs.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      console.log(`File not found for ID: ${fileId}`);
      return res.status(404).json({ status: 404, message: "File not found", extraDetails: "" });
    }

    const file = files[0];
    console.log(`Serving file: ${file.filename}, ID: ${fileId}`);
    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    gfs.openDownloadStream(fileId).pipe(res).on("error", (err) => {
      console.error(`Error streaming file ${fileId}:`, err);
      res.status(500).end();
    });
  } catch (error) {
    console.error("Error in getFile:", error);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { teacherName, email, phoneNumber, subject, classGrade, section } = req.body;
    const teacher = await Teacher.findById(req.user.userId);

    if (!teacher) {
      console.log(`Teacher not found for update: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Teacher not found", extraDetails: "" });
    }

    teacher.teacherName = teacherName || teacher.teacherName;
    teacher.email = email || teacher.email;
    teacher.phoneNumber = phoneNumber || teacher.phoneNumber;
    teacher.subject = subject || teacher.subject;
    teacher.classGrade = classGrade || teacher.classGrade;
    teacher.section = section || teacher.section;

    await teacher.save();
    console.log(`Profile updated for ${teacher.email}`);
    res.status(200).json({ status: 200, message: "Profile updated successfully", data: teacher });
  } catch (error) {
    next(error);
  }
};

const addStudent = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Student profile picture uploaded:", req.file ? req.file.originalname : "No file");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const { name, rollNo, classGrade, section, phoneNumber, email } = req.body;
      const teacherId = req.user.userId;

      const existingStudent = await Student.findOne({ $or: [{ rollNo }, { email }] });
      if (existingStudent) {
        return res.status(400).json({ status: 400, message: "Roll number or email already exists", extraDetails: "" });
      }

      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format (e.g., +1234567890 or 1234567890)" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let profilePictureId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        profilePictureId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => {
              console.log(`Student profile picture saved with ID: ${profilePictureId}`);
              resolve();
            });
        });
      }

      const rawPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const student = new Student({
        name,
        rollNo,
        classGrade,
        section,
        phoneNumber,
        email,
        password: hashedPassword,
        profilePicture: profilePictureId,
        teacher: teacherId,
        project: { title: "", description: "" },
        submittedPhotos: [],
      });

      await student.save();

      await sendEmail(
        email,
        "Your Student Account Credentials",
        `Dear ${name},\n\nYour student account has been created.\n\nLogin Details:\nRoll No: ${rollNo}\nPassword: ${rawPassword}\n\nPlease log in at ${process.env.FRONTEND_URL}/student-login and change your password after logging in.\n\nBest regards,\nEducationForAll Team`
      );

      console.log(`Student added: ${name}, Profile Picture ID: ${profilePictureId || "None"}, Password sent to ${email}`);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error adding student:", error);
      next(error);
    }
  },
];

const getStudents = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const students = await Student.find({ teacher: teacherId });
    console.log(`Fetched ${students.length} students for teacher ${teacherId}`);
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    next(error);
  }
};

const updateStudentProject = async (req, res, next) => {
  try {
    const { studentId, projectTitle, projectDescription } = req.body;
    const teacherId = req.user.userId;

    const student = await Student.findOne({ _id: studentId, teacher: teacherId });
    if (!student) {
      return res.status(404).json({ status: 404, message: "Student not found or not assigned to you", extraDetails: "" });
    }

    student.project = {
      title: projectTitle,
      description: projectDescription,
    };
    await student.save();

    await sendEmail(
      student.email,
      "Project Assignment Notification",
      `Dear ${student.name},\n\nA new project has been assigned to you:\n\nTitle: ${projectTitle}\nDescription: ${projectDescription}\n\nPlease submit your project photos via the student dashboard.\n\nBest regards,\nEducationForAll Team`
    );

    console.log(`Project updated and email notification sent for student ${student.name}: ${projectTitle}`);
    res.status(200).json({ status: 200, message: "Project updated successfully", data: student });
  } catch (error) {
    console.error("Error updating student project:", error);
    next(error);
  }
};

const studentLogin = async (req, res, next) => {
  try {
    const { rollNo, password } = req.body;
    const student = await Student.findOne({ rollNo });
    if (!student || !(await bcrypt.compare(password, student.password))) {
      console.log(`Login failed for rollNo: ${rollNo}`);
      return res.status(401).json({ status: 401, message: "Invalid credentials", extraDetails: "" });
    }
    const token = jwt.sign(
      { userId: student._id, role: "student" },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    console.log(`Login successful for rollNo: ${rollNo}, Token: ${token}`);
    res.json({ status: 200, message: "Login successful", token });
  } catch (error) {
    console.error("Student login error:", error);
    next(error);
  }
};

const getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.userId).select("-password");
    if (!student) {
      console.log(`Profile not found for studentId: ${req.user.userId}`);
      return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
    }
    console.log("Fetched student profile:", student);
    res.json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    next(error);
  }
};

const uploadStudentPhoto = [
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          } else if (err) {
            return reject(new Error(`Upload error: ${err.message}`));
          }
          console.log("Student project photo uploaded:", req.file ? req.file.originalname : "No file");
          resolve();
        });
      });
      next();
    } catch (error) {
      console.error("File upload failed:", error.message);
      res.status(400).json({ status: 400, message: "File upload failed", extraDetails: error.message });
    }
  },
  async (req, res, next) => {
    try {
      const studentId = req.user.userId;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ status: 404, message: "Student not found", extraDetails: "" });
      }

      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      let photoId = null;

      if (req.file) {
        const uploadStream = gfs.openUploadStream(`${Date.now()}-${req.file.originalname}`);
        const bufferStream = Readable.from(req.file.buffer);
        photoId = uploadStream.id;

        await new Promise((resolve, reject) => {
          bufferStream
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => {
              console.log(`Project photo saved with ID: ${photoId}`);
              resolve();
            });
        });

        student.submittedPhotos = student.submittedPhotos || [];
        student.submittedPhotos.push(photoId);
        await student.save();

        const teacher = await Teacher.findById(student.teacher);
        if (teacher) {
          await sendEmail(
            teacher.email,
            "Student Project Submission",
            `Dear ${teacher.teacherName},\n\n${student.name} (Roll No: ${student.rollNo}) has submitted a project photo for the project "${student.project.title}".\n\nPlease review it in the teacher dashboard.\n\nBest regards,\nEducationForAll Team`
          );
        }
      }

      console.log(`Photo uploaded for student ${student.name}, Photo ID: ${photoId}`);
      res.status(200).json({ status: 200, message: "Photo uploaded successfully", photoId });
    } catch (error) {
      console.error("Error uploading student photo:", error);
      next(error);
    }
  },
];

module.exports = {
  registerTeacher,
  verifyOTP,
  loginTeacher,
  forgotPassword,
  resetPassword,
  getProfile,
  getFile,
  updateProfile,
  addStudent,
  getStudents,
  updateStudentProject,
  studentLogin,
  getStudentProfile,
  uploadStudentPhoto,
};