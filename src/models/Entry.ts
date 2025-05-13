import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Topic from "./Topic";
import User from "./User";
import { EntryAttributes, EntryCreationAttributes } from "../interfaces";

class Entry
  extends Model<EntryAttributes, EntryCreationAttributes>
  implements EntryAttributes
{
  public entry_id!: number;
  public entry_content!: string;
  public entry_created_at!: Date;
  public entry_deleted_at!: Date | null;
  public entry_state!: string;
  public entry_parent_id!: number | null;
  public entry_posted_by_user_id!: number;
  public topic_id!: number;

  public static initModel(sequelize: Sequelize): void {
    Entry.init(
      {
        entry_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        entry_content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        entry_created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        entry_deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        entry_state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        entry_parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        entry_posted_by_user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        topic_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Entry",
        tableName: "entries",
        timestamps: false,
      },
    );
  }

  public static associate(): void {
    Entry.belongsTo(Topic, { foreignKey: "topic_id" });
    Entry.belongsTo(User, { foreignKey: "entry_posted_by_user_id" });

    Entry.belongsTo(Entry, {
      as: "ParentEntry",
      foreignKey: "entry_parent_id",
    });
    Entry.hasMany(Entry, { as: "Replies", foreignKey: "entry_parent_id" });
  }
}

export default Entry;
