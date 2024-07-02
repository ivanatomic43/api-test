import express from "express";
import filesRoutes from "./filesRoutes";

const router = express.Router();
router.use("/", filesRoutes);

export default router;
