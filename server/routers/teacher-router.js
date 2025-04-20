// const express = require("express");
// const router = express.Router();
// const {
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
// } = require("../controllers/teacher-controller");
// const { authMiddleware, validate } = require("../middlewares/teacher-middleware");
// const { loginSchema } = require("../validators/teacher-validator");

// router.post("/register", registerTeacher);
// router.post("/verify-otp", verifyOTP);
// router.post("/login", validate(loginSchema), loginTeacher);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.get("/profile", authMiddleware, getProfile);
// router.get("/file/:fileId", authMiddleware, getFile);
// router.put("/profile", authMiddleware, updateProfile);
// router.post("/students", authMiddleware, addStudent);
// router.get("/students", authMiddleware, getStudents);
// router.put("/students/project", authMiddleware, updateStudentProject);
// router.post("/students/login", validate(loginSchema), studentLogin);
// router.get("/students/profile", authMiddleware, getStudentProfile);
// router.post("/students/upload-photo", authMiddleware, uploadStudentPhoto);
// router.post("/students/bulk", authMiddleware, bulkAddStudents);
// router.get("/students/:studentId", authMiddleware, getStudentDetails);
// router.put("/students/:studentId", authMiddleware, updateStudent);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/teacher-controller');
const { authMiddleware, validate } = require('../middlewares/teacher-middleware');
const { loginSchema } = require('../validators/teacher-validator');

router.post('/register', registerTeacher);
router.post('/verify-otp', verifyOTP);
router.post('/login', validate(loginSchema), loginTeacher);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.get('/file/:fileId', authMiddleware, getFile);
router.put('/profile', authMiddleware, updateProfile);
router.post("/students", authMiddleware, addStudent);
router.get("/students", authMiddleware, getStudents);
router.put("/students/project", authMiddleware, updateStudentProject);
router.post("/students/login", validate(loginSchema), studentLogin);
router.get("/students/profile", authMiddleware, getStudentProfile);
router.post("/students/upload-photo", authMiddleware, uploadStudentPhoto);

module.exports = router;