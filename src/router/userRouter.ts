import { Router } from "express";
import { createUser, updateProfile, verifyOtp } from "../controller/userController.js";

const router = Router();

router.post('/login', createUser);
router.put('/verifyotp', verifyOtp);
router.put('/updateprofile', updateProfile);


export default router;