import { Request, Response, NextFunction } from "express";
import Enrollment from "../models/Enrollment";

/**
 * @param mode - "any" for general instructor access, "course" for course-specific
 * @param from - where to get the course id from (e.g., "params", "body", "query")
 * @param key - the key name holding the course_id (default: "course_id")
 */
export const requireInstructorAccess = (
  mode: "any" | "course",
  from?: "params" | "body" | "query",
  key = "courseId",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Admins always allowed
      if (req.user?.role === "admin") {
        return next();
      }

      // If mode is course-level
      if (mode === "course") {
        const courseId = req[from!]?.[key];

        if (!courseId) {
          return res
            .status(400)
            .json({ message: `Missing course ID in req.${from}.${key}` });
        }

        const match = await Enrollment.findOne({
          where: {
            user_id: req.user?.user_id,
            course_id: courseId,
            enrollment_type: "teacher",
            enrollment_state: "active",
          },
        });

        if (match) return next();
      }

      // If mode is general (any instructor role)
      if (mode === "any") {
        const count = await Enrollment.count({
          where: {
            user_id: req.user?.user_id,
            enrollment_type: "teacher",
            enrollment_state: "active",
          },
        });

        if (count > 0) return next();
      }

      return res
        .status(403)
        .json({ message: "Access denied: instructor or admin required." });
    } catch (err) {
      console.error("Instructor access error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
