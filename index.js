import express from "express";
import errorHandler from "./src/middleware/error.handler.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import { authenticate } from "./src/middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running di PORT : ${PORT}`);
});
