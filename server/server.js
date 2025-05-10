import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
mongoose.connection.on('error', (err) => {
    console.log(`Database connection error: ${err}`);
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5000',  // Add your frontend URL here if different
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Endpoints
app.get('/', (req, res) => {
  res.send('API is running.');
});
app.use('/api/auth', authRouter);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});