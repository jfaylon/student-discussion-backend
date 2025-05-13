import { Op, Sequelize } from "sequelize";
import Topic from "../models/Topic";
import Enrollment from "../models/Enrollment";

export const getDashboardTopicData = async (user: Express.User) => {
  if (user.role === "admin") {
    const allTopics = await Topic.findAll({
      attributes: [
        "topic_state",
        [Sequelize.fn("COUNT", Sequelize.col("topic_id")), "count"],
      ],
      group: ["topic_state"],
      raw: true,
    });
    return allTopics.reduce((acc: Record<string, number>, row: any) => {
      acc[row.topic_state] = Number(row.count);
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
      return {}; // no access
    }

    const topics = await Topic.findAll({
      where: {
        course_id: { [Op.in]: courseIds },
        topic_state: { [Op.ne]: "deleted" },
      },
      attributes: [
        "topic_state",
        [Sequelize.fn("COUNT", Sequelize.col("topic_id")), "count"],
      ],
      group: ["topic_state"],
      raw: true,
    });

    return topics.reduce((acc: Record<string, number>, row: any) => {
      acc[row.topic_state] = Number(row.count);
      return acc;
    }, {});
  }
};
