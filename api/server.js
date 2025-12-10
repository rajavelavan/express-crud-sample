import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes.js";
import dbConnect from "./db/mongodb-connect.js";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
dbConnect();

// app.get("/", (req, res) => {
//     console.log("API is running...");
//     res.send("API is running...");
// })

app.use("/api/employees", employeeRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

export default app;
