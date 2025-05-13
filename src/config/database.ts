import { Sequelize } from "sequelize";
import Credential from "../models/Credential";
import User from "../models/User";
import Login from "../models/Login";
import Topic from "../models/Topic";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";
import Entry from "../models/Entry";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

export const initializeDatabase = async () => {
  User.initModel(sequelize);
  Login.initModel(sequelize);
  Credential.initModel(sequelize);
  Course.initModel(sequelize);
  Enrollment.initModel(sequelize);
  Topic.initModel(sequelize);
  Entry.initModel(sequelize);

  User.associate();
  Login.associate();
  Credential.associate();
  Topic.associate();
  Course.associate();
  Enrollment.associate();
  Topic.associate();
  Entry.associate();

  await sequelize.sync({
    force:
      process.env.RESET_SEED === "true" && process.env.SEED_MODE === "true",
    alter: true,
  });
};
