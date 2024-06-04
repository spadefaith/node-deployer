import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Roles, RolesId } from './Roles';

export interface AccountsAttributes {
  account_id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  email?: string;
  otp?: string;
  role_id?: number;
  last_login_dt?: Date;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;
}

export type AccountsPk = "account_id";
export type AccountsId = Accounts[AccountsPk];
export type AccountsOptionalAttributes = "account_id" | "first_name" | "last_name" | "username" | "password" | "email" | "otp" | "role_id" | "last_login_dt" | "created_by" | "modified_by" | "is_active" | "modified_dt" | "created_dt";
export type AccountsCreationAttributes = Optional<AccountsAttributes, AccountsOptionalAttributes>;

export class Accounts extends Model<AccountsAttributes, AccountsCreationAttributes> implements AccountsAttributes {
  account_id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  email?: string;
  otp?: string;
  role_id?: number;
  last_login_dt?: Date;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;

  // Accounts belongsTo Roles via role_id
  role!: Roles;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Roles>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Roles, RolesId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Accounts {
    return Accounts.init({
    account_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    otp: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    last_login_dt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    modified_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_dt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'accounts',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_accounts_1",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "PRIMARY",
        unique: true,
        fields: [
          { name: "account_id" },
        ]
      },
      {
        name: "first_name_last_name",
        unique: true,
        fields: [
          { name: "first_name" },
          { name: "last_name" },
        ]
      },
      {
        name: "otp",
        unique: true,
        fields: [
          { name: "otp" },
        ]
      },
      {
        name: "email",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "username",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
  }
}
