import { Router } from "express";
import { login, logout, me } from "../controllers/AccountController";
import { authenticateLocal } from "../middleware/authenticateLocal";
import { checkToken } from "../middleware/checkToken";

const router = Router();

router.post("/login", authenticateLocal, login);

router.get("/me", checkToken, me);

router.post("/logout", logout);

export default router;
