import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/productRoutes.js";
import categorieRoutes from "./routes/categorieRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.use("/users", userRoutes);
app.use(errorHandler);
app.use("/roles", roleRoutes);
app.use(authRoutes); 
app.use("/products", productRoutes);
app.use("/categories", categorieRoutes);
app.use("/carts", cartRoutes);
app.use("/profile", profileRoutes);
app.use("/orders",orderRoutes)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
