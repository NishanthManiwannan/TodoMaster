import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/tasks", tasksRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
