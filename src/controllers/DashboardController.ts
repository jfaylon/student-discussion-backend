import { Request, Response, NextFunction } from "express";
import {
  getCourseData,
  getCoursesPerSemester,
  getDashboardCourses,
  getSemesters,
} from "../services/CourseService";
import { getDashboardUserData } from "../services/UserService";
import { getDashboardEnrollmentsData } from "../services/EnrollmentService";

export const getDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await getDashboardCourses(req.user!);
    const users = await getDashboardUserData(req.user!);
    const enrollments = await getDashboardEnrollmentsData(req.user!);
    const semesters = await getSemesters(req.user!);
    return res.json({
      role: req.user?.role,
      courses,
      users,
      enrollments,
      semesters,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSemesterList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const semesters = await getSemesters(req.user!);
  return res.json({ semesters });
};

export const getDashboardSemesterData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { year, month } = req.params;

  const semester = `${year}/${month}`;

  const semesterCourses = await getCoursesPerSemester(req.user!, semester);
  return res.json({ courses: semesterCourses });
};

export const getDashboardCourseData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { courseId } = req.params;
  const course = await getCourseData(courseId);

  return res.json({ course });
};
