const { z } = require('zod');

const registerSchema = z.object({
  teacherName: z.string().min(1, 'Teacher name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number format'),
  subject: z.string().min(1, 'Subject is required'),
  classGrade: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], {
    message: 'Invalid class grade',
  }),
  section: z.enum(['A', 'B', 'C', 'D'], { message: 'Invalid section' }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  rollNo: z.string().min(1, 'Roll number is required').optional(),
  password: z.string().min(1, 'Password is required'),
}).refine((data) => data.email || data.rollNo, {
  message: "Either email or rollNo is required",
  path: ["email", "rollNo"],
});

module.exports = { registerSchema, loginSchema };