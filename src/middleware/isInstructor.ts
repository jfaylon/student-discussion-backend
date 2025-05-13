import { Request, Response, NextFunction } from "express";
import Enrollment from "../models/Enrollment";

export const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const courses = await Enrollment.count({
    where: {
      user_id: req.user!.user_id,
      enrollment_type: "teacher",
      enrollment_state: "active",
    },
  });
  if (courses > 0) {
    return next();
  }
  return res.status(403).json({ message: "Instructor access required." });
};
