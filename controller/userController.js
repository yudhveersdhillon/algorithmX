const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Task = require("../models/task");

const Util = require("../utils/commonUtils");

const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey"; 

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (email && !Util.isValidEmail(email)) {
        return res.status(400).json({ message: "Invaid email format" });
      } else if (password && !Util.isValidPassword(password)) {
        return res.status(400).json({ message: "Invaid password format"});
      }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
    const result = user.toObject();
    result.token = token;
    result.password = undefined;
    return res.status(200).json({ message: "Login successful", result });
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
      let taskData = new Task(req.body);
      taskData.userId=req.user._id;
      await taskData.save();
  
      return res.status(200).json({ message: "Task Created successfully", taskData });
    } catch (err) {
      console.error("Task creation error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  exports.taskUpdate = async (req, res) => {
    try {
      const { taskId } = req.params;  
      const updatedData = req.body;  
  
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
      //hard delete done but if want to do soft Delete then update the status
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
  
      if (!tasks) {
        return res.status(404).json({ message: "No tasks found for this user" });
      }
  
      return res.status(200).json({ tasks });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };