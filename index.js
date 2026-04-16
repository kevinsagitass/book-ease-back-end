import express from "express";
import errorHandler from "./src/middleware/error.handler.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running di PORT : ${PORT}`);
});
