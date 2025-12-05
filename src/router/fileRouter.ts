import { Request, Response, Router } from "express";

const router = Router();

router.get('/chatapp', (req:Request, res:Response) => {
    res.download('./public/Chat-App.apk');
});

export default router;