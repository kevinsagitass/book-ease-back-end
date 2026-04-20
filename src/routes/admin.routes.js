import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboardStats);

export default router;
