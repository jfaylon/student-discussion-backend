import { Router } from "express";
import { isAdmin } from "../middleware/isAdmin";
import {
  getDashboardCourseData,
  getDashboardData,
  getDashboardSemesterData,
  getSemesterList,
} from "../controllers/DashboardController";
import { checkToken } from "../middleware/checkToken";
import { requireInstructorAccess } from "../middleware/requireInstructorAccess";

const router = Router();

router.get("/", checkToken, requireInstructorAccess("any"), getDashboardData);
router.get(
  "/semesters",
  checkToken,
  requireInstructorAccess("any"),
  getSemesterList,
);
router.get(
  "/semesters/:year/:month",
  checkToken,
  requireInstructorAccess("any"),
  getDashboardSemesterData,
);

router.get(
  "/courses/:courseId",
  checkToken,
  requireInstructorAccess("course", "params"),
  getDashboardCourseData,
);

export default router;
