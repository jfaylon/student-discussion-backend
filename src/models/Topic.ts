import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import Course from "./Course";
import Entry from "./Entry";
import User from "./User";
import { TopicAttributes, TopicCreationAttributes } from "../interfaces";

class Topic
  extends Model<TopicAttributes, TopicCreationAttributes>
  implements TopicAttributes
{
  public topic_id!: number;
  public topic_title!: string;
  public topic_content!: string;
  public topic_created_at!: Date;
  public topic_deleted_at!: Date | null;
  public topic_state!: string;
  public course_id!: number;
  public topic_posted_by_user_id!: number;

  public static initModel(sequelize: Sequelize) {
    Topic.init(
      {
        topic_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        topic_title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        topic_content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        topic_created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        topic_deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        topic_state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        course_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        topic_posted_by_user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Topic",
        tableName: "topics",
        timestamps: false,
      },
    );
  }

  public static associate(): void {
    Topic.belongsTo(Course, { foreignKey: "course_id" });
    Topic.hasMany(Entry, { foreignKey: "topic_id" });
    Topic.belongsTo(User, { foreignKey: "topic_posted_by_user_id" });
  }
}

export default Topic;
