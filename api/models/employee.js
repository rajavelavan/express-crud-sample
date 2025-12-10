import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
}, { timestamps: true });

EmployeeSchema.index({isDeleted: 1});

export default mongoose.model("Employee", EmployeeSchema);
