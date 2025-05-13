import { Op, Sequelize } from "sequelize";
import Enrollment from "../models/Enrollment";

export const getDashboardInstructorEnrollments = async (user: Express.User) => {
  const instructorEnrollments = await Enrollment.findAll({
    where: {
      user_id: user.user_id,
      enrollment_type: "teacher",
      enrollment_state: "active",
    },
    attributes: ["course_id"],
  });

  const courseIds = instructorEnrollments.map((e) => e.course_id);
  const enrollments = await Enrollment.findAll({
    where: {
      course_id: { [Op.in]: courseIds },
      enrollment_type: "student",
      enrollment_state: "active",
    },
    attributes: [
      "enrollment_type",
      "enrollment_state",
      [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
    ],
    group: ["enrollment_type", "enrollment_state"],
    raw: true,
  });
  const enrollmentTypeData = enrollments.reduce(
    (acc: Record<string, number>, row: any) => {
      const key = `${row.enrollment_type}_${row.enrollment_state}`;
      acc[key] = Number(row.count);
      return acc;
    },
    {},
  );
  return enrollmentTypeData;
};

export const getDashboardEnrollmentsData = async (user: Express.User) => {
  if (user.role === "admin") {
    const allEnrollments = await Enrollment.findAll({
      attributes: [
        "enrollment_state",
        "enrollment_type",
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
      ],
      group: ["enrollment_state", "enrollment_type"],
      raw: true,
    });
    // return allEnrollments;
    const enrollmentTypeData = allEnrollments.reduce(
      (acc: Record<string, number>, row: any) => {
        const key = `${row.enrollment_type}_${row.enrollment_state}`;
        acc[key] = Number(row.count);
        return acc;
      },
      {},
    );
    return enrollmentTypeData;
  } else {
    const instructorEnrollments = await getDashboardInstructorEnrollments(user);
    return instructorEnrollments;
  }
};
