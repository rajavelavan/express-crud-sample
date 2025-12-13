import express from "express";
import Employee from "../models/employee.js";
const router = express.Router();

// Get all active employees (soft delete filter)
router.get("/all/active-users", async (req, res) => {
  try {
    const employees = await Employee.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deleted employees", error: error.message });
  }
});

// Get all employees including soft deleted
router.get("/all/users", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
});

// Get soft deleted employees only
router.get("/deleted/list", async (req, res) => {
  try {
    const deletedEmployees = await Employee.find({ isDeleted: true }).sort({ deletedAt: -1 });
    res.json(deletedEmployees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deleted employees", error: error.message });
  }
});

// Get single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
});

// Create new employee
router.post("/add-user", async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;

    // Validation
    if (!name || !email || !position || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ 
      email: email.toLowerCase(),
      isDeleted: false 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newEmployee = new Employee({
      name,
      email: email.toLowerCase(),
      position,
      salary,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
});

// Update employee
router.put("/:id", async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;

    // Validation
    if (!name || !email || !position || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(410).json({ message: "Cannot update a deleted employee. Restore first." });
    }

    // Check for duplicate email (if email is being changed)
    if (email.toLowerCase() !== employee.email) {
      const existingEmployee = await Employee.findOne({
        email: email.toLowerCase(),
        isDeleted: false,
        _id: { $ne: req.params.id }
      });
      
      if (existingEmployee) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    employee.name = name;
    employee.email = email.toLowerCase();
    employee.position = position;
    employee.salary = salary;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
});

// Soft delete (mark as deleted)
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(410).json({ message: "Employee already soft deleted" });
    }

    employee.isDeleted = true;
    employee.deletedAt = new Date();

    const deletedEmployee = await employee.save();
    res.json({ 
      message: "Employee soft deleted successfully", 
      data: deletedEmployee 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
});

// Hard delete (permanently remove from database)
router.delete("/:id/permanent-delete", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ 
      message: "Employee permanently deleted", 
      data: employee 
    });
  } catch (error) {
    res.status(500).json({ message: "Error permanently deleting employee", error: error.message });
  }
});

// Restore soft deleted employee
router.patch("/:id/restore-user", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!employee.isDeleted) {
      return res.status(400).json({ message: "Employee is not deleted" });
    }

    employee.isDeleted = false;
    employee.deletedAt = null;

    const restoredEmployee = await employee.save();
    res.json({ 
      message: "Employee restored successfully", 
      data: restoredEmployee 
    });
  } catch (error) {
    res.status(500).json({ message: "Error restoring employee", error: error.message });
  }
});

export default router;