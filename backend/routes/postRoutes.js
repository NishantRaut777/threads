import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createPost, deletePost, getPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);

export default router;