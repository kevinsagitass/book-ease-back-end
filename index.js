import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import errorHandler from "./src/middleware/error.handler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running di PORT : ${PORT}`);
});
