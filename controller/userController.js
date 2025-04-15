const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Task = require("../models/task");

const Util = require("../utils/commonUtils");

const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey"; // use env var in production

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (email && !Util.isValidEmail(email)) {
        return res.status(400).json({ message: "Invaid email format" });
      } else if (password && !Util.isValidPassword(password)) {
        return res.status(400).json({ message: "Invaid password format"});
      }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "User registered successfully", user: user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.taskCreate = async (req, res) => {
    try {
      const { title } = req.body; 
      const task = await Task.findOne({ title });
      if (task) {
        return res.status(400).json({ message: "Same Task already Exists" });
      }
  
      const taskData = new Task(req.body); 
      await taskData.save();
  
      return res.status(200).json({ message: "Task Created successfully", taskData });
    } catch (err) {
      console.error("Task creation error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  exports.taskUpdate = async (req, res) => {
    try {
      const { taskId } = req.params;  // Get task ID from the route parameter
      const updatedData = req.body;  // Get updated task data from the body
  
      const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      return res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  
  exports.getAllTasksByUser = async (req, res) => {
    try {
      const userId = req.user._id; 
      
      const tasks = await Task.find({ userId }); 
  
      if (!tasks.length) {
        return res.status(404).json({ message: "No tasks found for this user" });
      }
  
      return res.status(200).json({ tasks });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  exports.taskDelete = async (req, res) => {
    try {
      const { taskId } = req.params;  
      const deletedTask = await Task.findByIdAndDelete(taskId);
      
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      return res.status(200).json({ message: "Task deleted successfully", deletedTask });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.getPerTask = async (req, res) => {
    try {
      const { taskId } = req.params; 
      
      const tasks = await Task.findOne({ _id:taskId }); 
  
      if (!tasks.length) {
        return res.status(404).json({ message: "No tasks found for this user" });
      }
  
      return res.status(200).json({ tasks });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };