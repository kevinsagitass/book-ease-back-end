import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  getDashboardStats,
  getAdminBookings,
  updateBookingStatus,
  createService,
  updateService,
  deleteService,
  getAllUsers,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", getDashboardStats);
router.get("/bookings", getAdminBookings);
router.patch("/bookings/:id/status", updateBookingStatus);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);
router.get("/users", getAllUsers);

export default router;
