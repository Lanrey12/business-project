import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/userRouter.js'

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongodb server is connected...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is started on port: 3000");
});

app.use('/api/user', userRouter )