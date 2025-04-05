require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb = require('./utils/db');
const teacherRouter = require('./routers/teacher-router');
const { errorMiddleware } = require('./middlewares/teacher-middleware');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:5173','https://eduationforall.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/teachers', teacherRouter);
app.use(errorMiddleware);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });