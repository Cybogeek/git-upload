import express from "express";
import { ensureAuthenticated } from "../config/auth.js";

const router = express.Router();

// Secrets Page
router.get("/", ensureAuthenticated, (req, res) => res.render("secret"));

export default router;
