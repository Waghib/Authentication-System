import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
mongoose.connection.on('error', (err) => {
    console.log(`Database connection error: ${err}`);
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

app.get('/', (req, res) => {
    res.send('API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});