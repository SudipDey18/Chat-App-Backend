import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRooms,
} from "../controller/privateChatControler.js";

const router = Router();

router.post("/create", createRoom);
router.get("/getRooms", getRooms);
router.delete("/room/:id", deleteRoom);

export default router;
