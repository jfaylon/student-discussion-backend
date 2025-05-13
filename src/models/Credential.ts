import { Model, DataTypes, Sequelize, Optional } from "sequelize";
import bcrypt from "bcrypt";
import {
  CredentialAttributes,
  CredentialCreationAttributes,
} from "../interfaces";
import Login from "./Login";

class Credential
  extends Model<CredentialAttributes, CredentialCreationAttributes>
  implements CredentialAttributes
{
  public credential_id!: number;
  public type!: string;
  public user_login_id!: string;
  public secret!: string | null;
  public created_at!: Date;
  public role!: string;
  public Login?: Login;

  public verifyPassword(inputPassword: string): boolean {
    if (!this.secret) return false;
    return bcrypt.compareSync(inputPassword, this.secret);
  }

  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static initModel(sequelize: Sequelize): void {
    Credential.init(
      {
        credential_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_login_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        secret: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "credentials",
        indexes: [
          {
            unique: true,
            fields: ["type", "user_login_id"],
          },
        ],
      },
    );
  }

  public static associate(): void {
    Credential.belongsTo(Login, {
      foreignKey: "user_login_id",
      targetKey: "user_login_id",
    });
  }
}

export default Credential;
