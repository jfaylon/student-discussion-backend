import { Request, Response, NextFunction } from "express";
import Enrollment from "../models/Enrollment";

/**
 * Checks if the user is admin or an instructor for a specific course
 * @param courseIdFrom - where to extract course_id from (e.g., "params", "body")
 * @param key - the key name to use (e.g., "course_id" or "id")
 */
export const isAdminOrCourseInstructor = (
  courseIdFrom: "params" | "body" | "query",
  key: string = "course_id",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Allow admin
      if (req.user?.role === "admin") {
        return next();
      }

      const course_id = req[courseIdFrom]?.[key];

      if (!course_id) {
        return res
          .status(400)
          .json({
            message: `Missing course identifier in ${courseIdFrom}.${key}`,
          });
      }

      const enrollment = await Enrollment.findOne({
        where: {
          user_id: req.user?.user_id,
          course_id: course_id,
          enrollment_type: "teacher",
          enrollment_state: "active",
        },
      });

      if (enrollment) {
        return next();
      }

      return res
        .status(403)
        .json({ message: "Access denied: not an instructor for this course." });
    } catch (err) {
      console.error("Access control error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
