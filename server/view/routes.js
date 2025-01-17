import express from "express";
import { getAllUsers, addUser, updateUser, deleteUser, checkUser, verifyToken, getUserData } from "../controller/UserController.js";
const router = express.Router();

router.get("/getAll",getAllUsers);
router.post("/addUser",addUser);
router.put("/user/update",verifyToken,updateUser);
router.delete("/user/:id",deleteUser);
router.post("/user/check",checkUser);
router.get("/user/getUser",verifyToken,getUserData);

export default router;