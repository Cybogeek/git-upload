import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// In-memory data store
let tasks = [];

// Routes
app.get("/", (req, res) => {
  res.render("index", { tasks });
});

app.post("/add", (req, res) => {
  const newTask = req.body.task;
  tasks.push(newTask);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks[taskId];
  res.render("edit", { taskId, task });
});

app.post("/edit/:id", (req, res) => {
  const taskId = req.params.id;
  tasks[taskId] = req.body.task;
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  const taskId = req.params.id;
  tasks.splice(taskId, 1);
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
