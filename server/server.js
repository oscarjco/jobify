import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import dotenv from "dotenv";
dotenv.config();

import 'express-async-errors';
import morgan from "morgan";

// Database
import connectDB from "./db/connect.js";

// Routers
const baseUrl = `${process.env.API_PATH}`;

import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';
import authenticateUser from './middleware/auth.js'
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/jobs`, authenticateUser, jobsRouter);

// Middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

if(process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.get(baseUrl, (req, res) => {res.json({msg: 'Hello there!'})});

const port = process.env.port || 5000;

const start = async () => {
  try {
    await connectDB(process.env.DB_URL);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start()