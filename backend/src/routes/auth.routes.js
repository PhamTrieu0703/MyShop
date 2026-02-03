import express from "express";
import { registerUser } from "../controllers/userController.js";
import { DoLogin } from "../controllers/userController.js";
import { forgotPassword } from "../controllers/userController.js";
import { resetPassword } from "../controllers/userController.js";
const router = express.Router();

router.post("/login", DoLogin);

router.post("/register", registerUser);    
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;