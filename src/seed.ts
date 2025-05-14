import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();
import { initializeDatabase } from "./config/database";
import Credential from "./models/Credential";
import User from "./models/User";
import Login from "./models/Login";
import Enrollment from "./models/Enrollment";
import Topic from "./models/Topic";
import Entry from "./models/Entry";
import Course from "./models/Course";
import {
  CourseCreationAttributes,
  EnrollmentCreationAttributes,
  EntryCreationAttributes,
  LoginCreationAttributes,
  TopicCreationAttributes,
  UserCreationAttributes,
} from "./interfaces";

(async () => {
  process.env.SEED_MODE = "true";
  try {
    await initializeDatabase();
    // add admin user
    const adminPassword = process.env.SEED_ADMIN_PASSWORD!;
    const hashedAdminPassword = Credential.hashPassword(adminPassword);
    await User.create({
      user_id: -1,
      user_name: "admin_01",
      user_created_at: new Date(),
      user_deleted_at: null,
      user_state: "admin",
    });

    await Login.create({
      user_id: -1,
      user_login_id: "admin",
    });

    await Credential.create({
      type: "password",
      user_login_id: "admin",
      secret: hashedAdminPassword,
    });

    const usersSheet = xlsx.readFile(`${__dirname}/../seeds/users.xlsx`).Sheets[
      "Sheet1"
    ];
    const rawUsers = xlsx.utils.sheet_to_json<Record<string, any>>(usersSheet);
    const users: UserCreationAttributes[] = rawUsers.map((row) => ({
      user_id: Number(row["user_id"]),
      user_name: String(row["user_name"]),
      user_created_at: new Date(row["user_created_at"]),
      user_deleted_at:
        row["user_deleted_at"] !== "NA"
          ? new Date(row["user_deleted_at"])
          : null,
      user_state: String(row["user_state"]),
    }));
    await User.bulkCreate(users);

    const loginSheet = xlsx.readFile(`${__dirname}/../seeds/login.xlsx`).Sheets[
      "Sheet1"
    ];
    const rawLogins = xlsx.utils.sheet_to_json<Record<string, any>>(loginSheet);
    const logins: LoginCreationAttributes[] = rawLogins.map((row) => ({
      user_login_id: String(row["user_login_id"]),
      user_id: Number(row["user_id"]),
    }));
    await Login.bulkCreate(logins);

    const coursesSheet = xlsx.readFile(`${__dirname}/../seeds/courses.xlsx`)
      .Sheets["Sheet1"];
    const rawCourses =
      xlsx.utils.sheet_to_json<Record<string, any>>(coursesSheet);
    const courses: CourseCreationAttributes[] = rawCourses.map((row) => ({
      course_id: Number(row["course_id"]),
      course_name: String(row["course_name"]),
      course_code: String(row["course_code"]),
      course_created_at: new Date(row["course_created_at"]),
      course_description: String(row["course_description"]),
      semester: String(row["semester"]),
    }));
    await Course.bulkCreate(courses);

    const enrollSheet = xlsx.readFile(`${__dirname}/../seeds/enrollment.xlsx`)
      .Sheets["Sheet1"];
    const rawEnroll =
      xlsx.utils.sheet_to_json<Record<string, any>>(enrollSheet);
    const enrollments: EnrollmentCreationAttributes[] = rawEnroll.map(
      (row) => ({
        user_id: Number(row["user_id"]),
        course_id: Number(row["course_id"]),
        enrollment_type: String(row["enrollment_type"]),
        enrollment_state: String(row["enrollment_state"]),
      }),
    );
    await Enrollment.bulkCreate(enrollments);

    const topicsSheet = xlsx.readFile(`${__dirname}/../seeds/topics.xlsx`)
      .Sheets["Sheet1"];
    const rawTopics =
      xlsx.utils.sheet_to_json<Record<string, any>>(topicsSheet);
    const topics: TopicCreationAttributes[] = rawTopics.map((row) => ({
      topic_id: Number(row["topic_id"]),
      topic_title: String(row["topic_title"]),
      topic_content: String(row["topic_content"]),
      topic_created_at: new Date(row["topic_created_at"]),
      topic_deleted_at:
        row["topic_deleted_at"] !== "NA"
          ? new Date(row["topic_deleted_at"])
          : null,
      topic_state: String(row["topic_state"]),
      course_id: Number(row["course_id"]),
      topic_posted_by_user_id: Number(row["topic_posted_by_user_id"]),
    }));
    await Topic.bulkCreate(topics);

    const entriesSheet = xlsx.readFile(`${__dirname}/../seeds/entries.xlsx`)
      .Sheets["Sheet1"];
    const rawEntries =
      xlsx.utils.sheet_to_json<Record<string, any>>(entriesSheet);
    const entries: EntryCreationAttributes[] = rawEntries.map((row) => ({
      entry_id: Number(row["entry_id"]),
      entry_content: String(row["entry_content"]),
      entry_created_at: new Date(row["entry_created_at"]),
      entry_deleted_at:
        row["entry_deleted_at"] !== "NA"
          ? new Date(row["entry_deleted_at"])
          : null,
      entry_state: String(row["entry_state"]),
      entry_parent_id:
        row["entry_parent_id"] !== "NA" ? Number(row["entry_parent_id"]) : null,
      entry_posted_by_user_id: Number(row["entry_posted_by_user_id"]),
      topic_id: Number(row["topic_id"]),
    }));
    await Entry.bulkCreate(entries);

    // ADD INSTRUCTOR ACCOUNT TO CREDENTIALS
    const instructorPassword = process.env.SEED_INSTRUCTOR_PASSWORD!;
    const hashedInstructorPassword =
      Credential.hashPassword(instructorPassword);
    await Credential.create({
      type: "password",
      user_login_id: "x14gpx0a",
      secret: hashedInstructorPassword,
    });
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
})();
