import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import employeeRoutes from "./routes/employeeroutes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/employeeDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/employees", employeeRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
