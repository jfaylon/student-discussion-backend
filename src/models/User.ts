import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import Credential from "./Credential"; // import the Credential model
import Enrollment from "./Enrollment";
import Entry from "./Entry";
import Login from "./Login";
import { UserAttributes, UserCreationAttributes } from "../interfaces";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public user_id!: number;
  public user_name!: string;
  public user_created_at!: Date;
  public user_deleted_at!: Date | null;
  public user_state!: string;

  public readonly credentials?: Credential[];

  public static initModel(sequelize: Sequelize): void {
    User.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        user_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_created_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        user_deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        user_state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "users",
        timestamps: false,
      },
    );
  }

  public static associate(): void {
    User.hasOne(Login, { foreignKey: "user_id" });
    User.hasMany(Enrollment, { foreignKey: "user_id" });
    User.hasMany(Entry, { foreignKey: "user_id" });
  }
}

export default User;
