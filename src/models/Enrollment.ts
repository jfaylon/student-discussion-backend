import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Course from "./Course";
import User from "./User";
import { EnrollmentAttributes, EnrollmentCreationAttributes } from "../interfaces";

class Enrollment
  extends Model<EnrollmentAttributes, EnrollmentCreationAttributes>
  implements EnrollmentAttributes
{
  public user_id!: number;
  public course_id!: number;
  public enrollment_type!: string;
  public enrollment_state!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Enrollment.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        course_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        enrollment_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        enrollment_state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "enrollments",
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ["user_id", "course_id"],
          },
        ],
      },
    );
  }

  public static associate(): void {
    Enrollment.belongsTo(User, { foreignKey: "user_id" });
    Enrollment.belongsTo(Course, { foreignKey: "course_id" });
  }
}

export default Enrollment;
