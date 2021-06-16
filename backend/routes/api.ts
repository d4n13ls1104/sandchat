import { Router } from "express";

import userRouter from "./api/user";
import channelRouter from "./api/channels";

const router = Router();


router.use("/user", userRouter);
router.use("/channels", channelRouter);

export default router;
