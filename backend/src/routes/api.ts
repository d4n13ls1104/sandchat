import { Router } from "express";

import userRouter from "routes/api/user";
import channelRouter from "routes/api/channels";

const router = Router();


router.use("/user", userRouter);
router.use("/channels", channelRouter);

export default router;