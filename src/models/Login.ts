import { DataTypes, Model, Sequelize, Optional } from "sequelize";
import User from "./User";
import Credential from "./Credential";
import { LoginAttributes, LoginCreationAttributes } from "../interfaces";

class Login
  extends Model<LoginAttributes, LoginCreationAttributes>
  implements LoginAttributes
{
  public user_id!: number;
  public user_login_id!: string;
  public User?: User;

  public static initModel(sequelize: Sequelize): void {
    Login.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
        },
        user_login_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: "Login",
        tableName: "logins",
        timestamps: false,
      },
    );
  }

  public static associate(): void {
    Login.belongsTo(User, { foreignKey: "user_id" });
    Login.hasMany(Credential, {
      foreignKey: "user_login_id",
      sourceKey: "user_login_id",
    });
  }
}

export default Login;
