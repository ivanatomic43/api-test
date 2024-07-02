"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filesController_1 = __importDefault(require("../controllers/filesController"));
const router = express_1.default.Router();
router.get("/api/files", filesController_1.default.fetchFiles);
exports.default = router;
