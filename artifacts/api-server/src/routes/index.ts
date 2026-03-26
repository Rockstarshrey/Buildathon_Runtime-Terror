import { Router, type IRouter } from "express";
import healthRouter from "./health";
import communityRouter from "./community";
import pricesRouter from "./prices";
import schemesRouter from "./schemes";
import aiRouter from "./ai";
import ttsRouter from "./tts";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/community", communityRouter);
router.use("/prices", pricesRouter);
router.use("/schemes", schemesRouter);
router.use("/ai", aiRouter);
router.use("/tts", ttsRouter);

export default router;
