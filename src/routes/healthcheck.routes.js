//healthcheck routes--->to handle the healthcheck related requests
import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
const router = Router();
//routes declaration
router.route("/").get(healthcheck);
export default router;