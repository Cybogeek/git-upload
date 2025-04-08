import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engineclear

app.set("view engine", "ejs");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/todoDB")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  }); // Connect to the todoDB database

// // In-memory data store
// let tasks = [];
// Define Task Schema
const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
});

// Create Task Model
const Task = mongoose.model("Task", taskSchema);
// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render("index", { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  const newTask = new Task({ description: req.body.task });
  try {
    await newTask.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.render("edit", { task });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { description: req.body.task });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
