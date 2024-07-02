import express from "express";
import filesController from "../controllers/filesController";

const router = express.Router();

router.get("/api/files", filesController.fetchFiles);

export default router;
