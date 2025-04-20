const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  classGrade: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  },
  section: { type: String, required: true, enum: ["A", "B", "C", "D"] },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "Uploads.files" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  project: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  submittedPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Uploads.files" }], // New field for submitted photos
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);