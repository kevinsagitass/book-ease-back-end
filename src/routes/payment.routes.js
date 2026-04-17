import express from "express";
import { createPayment, handleWebhook } from "../controllers/payment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(`/webhook`, handleWebhook);
router.use(authenticate);
router.post(`/:bookingId/create`, createPayment);

export default router;
