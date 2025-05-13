import { Op, Sequelize } from "sequelize";
import Entry from "../models/Entry";
import Topic from "../models/Topic";
import Enrollment from "../models/Enrollment";

export const getDashboardEntryData = async (user: Express.User) => {
  if (user.role === "admin") {
    const allEntries = await Entry.findAll({
      attributes: [
        "entry_state",
        [Sequelize.fn("COUNT", Sequelize.col("entry_id")), "count"],
      ],
      group: ["entry_state"],
      raw: true,
    });
    return allEntries.reduce((acc: Record<string, number>, row: any) => {
      acc[row.entry_state] = Number(row.count);
      return acc;
    }, {});
  } else {
    const enrollments = await Enrollment.findAll({
      where: {
        user_id: user.user_id,
        enrollment_type: "teacher",
        enrollment_state: "active",
      },
      attributes: ["course_id"],
      raw: true,
    });

    const courseIds = enrollments.map((e) => e.course_id);

    if (courseIds.length === 0) {
      return {};
    }

    const entries = await Entry.findAll({
      include: [
        {
          model: Topic,
          attributes: [],
          where: {
            course_id: { [Op.in]: courseIds },
          },
        },
      ],
      where: {
        entry_state: { [Op.ne]: "deleted" },
      },
      attributes: [
        "entry_state",
        [Sequelize.fn("COUNT", Sequelize.col("entry_id")), "count"],
      ],
      group: ["entry_state"],
      raw: true,
    });
    return entries.reduce((acc: Record<string, number>, row: any) => {
      acc[row.entry_state] = Number(row.count);
      return acc;
    }, {});
  }
};
