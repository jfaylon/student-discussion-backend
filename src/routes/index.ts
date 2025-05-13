import { Router } from "express";
import DashboardRouter from "./DashboardRouter";
import AccountRouter from "./AccountRouter";

const router = Router();

// Define your routes here
router.get("/", (req, res) => {
  res.send("Welcome to the Student Discussion Backend!");
});

router.use("/account", AccountRouter);
router.use("/dashboard", DashboardRouter);

export default router;
