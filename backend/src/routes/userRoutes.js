import express from "express";
import { getUsers,deleteUsers,updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.delete("/:_id",deleteUsers)
router.put("/:_id", updateUser)

export default router;
