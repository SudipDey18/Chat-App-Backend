import { Router } from "express";
import { getContacts, getMessage, searchContact } from "../controller/messageController";

const router = Router();

router.get('/searchname', searchContact);
router.get('/allmessages/:receiver', getMessage);
router.get('/contacts', getContacts);


export default router;