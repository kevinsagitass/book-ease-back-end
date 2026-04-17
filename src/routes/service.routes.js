import express from "express";
import {
  getAllService,
  getServiceById,
  getServiceSlots
} from "../controllers/service.controller.js";

const router = express.Router();

router.get(`/`, getAllService);
router.get(`/:id`, getServiceById);
router.get(`/:id/slots`, getServiceSlots);

export default router;
