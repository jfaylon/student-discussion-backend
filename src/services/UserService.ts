import User from "../models/User";
import Enrollment from "../models/Enrollment";
import Sequelize, { Op } from "sequelize";

export const getDashboardUserData = async (
  user: Express.User,
): Promise<Record<string, number>> => {
  if (user.role === "admin") {
    const results = await User.findAll({
      where: {
        user_state: { [Op.ne]: "admin" },
      },
      attributes: [
        "user_state",
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
      ],
      group: ["user_state"],
      raw: true,
    });

    return results.reduce((acc: Record<string, number>, row: any) => {
      acc[row.user_state] = Number(row.count);
      return acc;
    }, {});
  } else {
    const instructorEnrollments = await Enrollment.findAll({
      where: {
        user_id: user.user_id,
        enrollment_type: "teacher",
        enrollment_state: "active",
      },
      attributes: ["course_id"],
      raw: true,
    });

    const courseIds = instructorEnrollments.map((e) => e.course_id);

    if (courseIds.length === 0) {
      return {};
    }

    const userEnrollments = await Enrollment.findAll({
      where: {
        course_id: { [Op.in]: courseIds },
        enrollment_type: "student",
        enrollment_state: "active",
      },
      attributes: ["user_id"],
      raw: true,
    });

    const userIds = Array.from(new Set(userEnrollments.map((e) => e.user_id)));

    if (userIds.length === 0) {
      return {};
    }

    const users = await User.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        user_state: { [Op.ne]: "deleted" },
      },
      attributes: [
        "user_state",
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "count"],
      ],
      group: ["user_state"],
      raw: true,
    });

    return users.reduce((acc: Record<string, number>, row: any) => {
      acc[row.user_state] = Number(row.count);
      return acc;
    }, {});
  }
};
