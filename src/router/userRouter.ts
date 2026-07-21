import { Router } from "express";
import {
  createUser,
  getPublicKey,
  updateProfile,
  verifyOtp,
} from "../controller/userController.js";

const router = Router();

router.post("/login", createUser);
router.put("/verifyotp", verifyOtp);
router.put("/updateprofile", updateProfile);
router.get("/publickey/:id", getPublicKey);

export default router;
