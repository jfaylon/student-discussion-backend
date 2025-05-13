import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Enrollment from "./Enrollment";
import Topic from "./Topic";
import { CourseAttributes, CourseCreationAttributes } from "../interfaces";

class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  public course_id!: number;
  public semester!: string;
  public course_code!: string;
  public course_name!: string;
  public course_created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Course.init(
      {
        course_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        semester: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        course_code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        course_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        course_created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Course",
        tableName: "courses",
        timestamps: true,
      },
    );
  }

  public static associate(): void {
    Course.hasMany(Enrollment, { foreignKey: "course_id" });
    Course.hasMany(Topic, { foreignKey: "course_id" });
  }
}

export default Course;
