import natural from "natural";
import { Op, Sequelize } from "sequelize";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import Entry from "../models/Entry";
import Topic from "../models/Topic";
import {
  EnrollmentCount,
  EntryCount,
  FlatEntry,
  TopicsCount,
} from "../interfaces";

const stopWords = [
  "the",
  "and",
  "that",
  "with",
  "you",
  "this",
  "are",
  "for",
  "have",
  "not",
  "but",
  "was",
  "all",
];

export const getDashboardCourses = async (user: Express.User) => {
  if (user.role === "admin") {
    const allCourses = await Course.findAll();
    return allCourses;
  } else {
    const instructorEnrollments = await Enrollment.findAll({
      where: {
        user_id: user.user_id,
        enrollment_type: "teacher",
        enrollment_state: "active",
      },
      attributes: ["course_id"],
    });

    const courseIds = instructorEnrollments.map((e) => e.course_id);
    const instructorCourses = await Course.findAll({
      where: { course_id: courseIds },
    });
    return instructorCourses;
  }
};

export const getSemesters = async (user: Express.User) => {
  const courses = await getDashboardCourses(user);
  return Array.from(new Set(courses.map((course) => course.semester)));
};

export const getCoursesPerSemester = async (
  user: Express.User,
  semester: string,
) => {
  if (user.role !== "admin") {
    const instructorEnrollments = await Enrollment.findAll({
      where: {
        user_id: user.user_id,
        enrollment_type: "teacher",
        enrollment_state: "active",
      },
      attributes: ["course_id"],
    });

    const instructorCourseIds = instructorEnrollments.map((e) => e.course_id);
    const courses = await Course.findAll({
      where: { course_id: { [Op.in]: instructorCourseIds }, semester },
      raw: true,
    });

    const courseIds = courses.map((c) => c.course_id);

    const enrollments = (await Enrollment.findAll({
      where: {
        course_id: { [Op.in]: courseIds },
        enrollment_type: "student",
        enrollment_state: "active",
      },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "student_count"],
      ],
      group: ["course_id"],
      raw: true,
    })) as unknown as EnrollmentCount[];

    const enrollmentMap = Object.fromEntries(
      enrollments.map((e) => [e.course_id, Number(e.student_count)]),
    );

    const topics = (await Topic.findAll({
      where: {
        course_id: { [Op.in]: courseIds },
        topic_state: "active",
      },
      attributes: [
        "course_id",
        [Sequelize.fn("COUNT", Sequelize.col("topic_id")), "topic_count"],
      ],
      group: ["course_id"],
      raw: true,
    })) as unknown as TopicsCount[];

    const topicMap = Object.fromEntries(
      topics.map((t) => [t.course_id, Number(t.topic_count)]),
    );

    const entries = (await Entry.findAll({
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
        [Sequelize.col("Topic.course_id"), "course_id"],
        [Sequelize.fn("COUNT", Sequelize.col("entry_id")), "entry_count"],
      ],
      group: ["Topic.course_id"],
      raw: true,
    })) as unknown as EntryCount[];

    const entryMap = Object.fromEntries(
      entries.map((e) => [e.course_id, Number(e.entry_count)]),
    );

    const enrichedCourses = courses.map((course) => ({
      ...course,
      student_count: enrollmentMap[course.course_id] ?? 0,
      topic_count: topicMap[course.course_id] ?? 0,
      entry_count: entryMap[course.course_id] ?? 0,
    }));

    return enrichedCourses;
  }

  const courses = await Course.findAll({
    where: { semester },
    raw: true,
  });

  const courseIds = courses.map((c) => c.course_id);

  const enrollments = (await Enrollment.findAll({
    where: {
      course_id: { [Op.in]: courseIds },
      enrollment_type: "student",
      enrollment_state: "active",
    },
    attributes: [
      "course_id",
      [Sequelize.fn("COUNT", Sequelize.col("user_id")), "student_count"],
    ],
    group: ["course_id"],
    raw: true,
  })) as unknown as EnrollmentCount[];

  const enrollmentMap = Object.fromEntries(
    enrollments.map((e) => [e.course_id, Number(e.student_count)]),
  );

  const topics = (await Topic.findAll({
    where: {
      course_id: { [Op.in]: courseIds },
      topic_state: "active",
    },
    attributes: [
      "course_id",
      [Sequelize.fn("COUNT", Sequelize.col("topic_id")), "topic_count"],
    ],
    group: ["course_id"],
    raw: true,
  })) as unknown as TopicsCount[];

  const topicMap = Object.fromEntries(
    topics.map((t) => [t.course_id, Number(t.topic_count)]),
  );

  const entries = (await Entry.findAll({
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
      [Sequelize.col("Topic.course_id"), "course_id"],
      [Sequelize.fn("COUNT", Sequelize.col("entry_id")), "entry_count"],
    ],
    group: ["Topic.course_id"],
    raw: true,
  })) as unknown as EntryCount[];

  const entryMap = Object.fromEntries(
    entries.map((e) => [e.course_id, Number(e.entry_count)]),
  );

  const enrichedCourses = courses.map((course) => ({
    ...course,
    student_count: enrollmentMap[course.course_id] ?? 0,
    topic_count: topicMap[course.course_id] ?? 0,
    entry_count: entryMap[course.course_id] ?? 0,
  }));

  return enrichedCourses;
};

export const getCourseData = async (courseId: string) => {
  const course = await Course.findOne({
    where: { course_id: courseId },
    raw: true,
  });

  if (!course) {
    throw new Error("Not found");
  }

  const studentCount = await Enrollment.count({
    where: {
      course_id: courseId,
      enrollment_type: "student",
      enrollment_state: "active",
    },
  });

  const entries = (await Entry.findAll({
    include: [
      {
        model: Topic,
        attributes: ["topic_id", "topic_title"],
        where: {
          course_id: courseId,
        },
      },
    ],
    where: {
      entry_state: { [Op.ne]: "deleted" },
    },
    raw: true,
  })) as unknown as FlatEntry[];

  const grouped: Record<
    number,
    {
      topic_id: number;
      topic_title: string;
      entry_count: number;
    }
  > = {};

  for (const entry of entries) {
    const topicId = entry["Topic.topic_id"];
    const topicTitle = entry["Topic.topic_title"];

    if (!grouped[topicId]) {
      grouped[topicId] = {
        topic_id: topicId,
        topic_title: topicTitle,
        entry_count: 0,
      };
    }

    grouped[topicId].entry_count++;
  }

  const groupedByTopic = Object.values(grouped);
  const wordFrequency: Record<string, number> = {};
  const tokenizer = new natural.WordTokenizer();
  const tokenize = (text: string): string[] => {
    return tokenizer
      .tokenize(text.toLowerCase())
      .filter((w) => w.length > 2 && !stopWords.includes(w));
  };

  for (const entry of entries) {
    const words = tokenize(entry.entry_content);
    for (const word of words) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  }

  return {
    ...course,
    student_count: studentCount,
    topics: groupedByTopic,
    wordFrequency,
  };
};
