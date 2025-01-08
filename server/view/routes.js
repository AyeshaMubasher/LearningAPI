import express from "express";
import { getAllUsers, addUser, updateUser, deleteUser } from "../controller/UserController.js";
const router = express.Router();

router.get("/getAll",getAllUsers);
router.post("/addUser",addUser);
router.put("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);

export default router;