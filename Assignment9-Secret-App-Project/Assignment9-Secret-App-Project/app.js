import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session and Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Make `user` available to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // `req.user` is set by Passport
  next();
});

// Passport Config
import configurePassport from "./config/passport.js";
configurePassport(passport);

// Routes
import authRoutes from "./routes/auth.js";
import secretsRoutes from "./routes/secrets.js";
app.use("/", authRoutes);
app.use("/secrets", secretsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
