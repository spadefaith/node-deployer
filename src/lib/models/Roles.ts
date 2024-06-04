import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Accounts, AccountsId } from './Accounts';
import type { RolePermissions, RolePermissionsId } from './RolePermissions';

export interface RolesAttributes {
  role_id?: number;
  description?: string;
  ref_name?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;
}

export type RolesPk = "role_id";
export type RolesId = Roles[RolesPk];
export type RolesOptionalAttributes = "role_id" | "description" | "ref_name" | "created_by" | "modified_by" | "is_active" | "modified_dt" | "created_dt";
export type RolesCreationAttributes = Optional<RolesAttributes, RolesOptionalAttributes>;

export class Roles extends Model<RolesAttributes, RolesCreationAttributes> implements RolesAttributes {
  role_id?: number;
  description?: string;
  ref_name?: string;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;

  // Roles hasMany Accounts via role_id
  accounts!: Accounts[];
  getAccounts!: Sequelize.HasManyGetAssociationsMixin<Accounts>;
  setAccounts!: Sequelize.HasManySetAssociationsMixin<Accounts, AccountsId>;
  addAccount!: Sequelize.HasManyAddAssociationMixin<Accounts, AccountsId>;
  addAccounts!: Sequelize.HasManyAddAssociationsMixin<Accounts, AccountsId>;
  createAccount!: Sequelize.HasManyCreateAssociationMixin<Accounts>;
  removeAccount!: Sequelize.HasManyRemoveAssociationMixin<Accounts, AccountsId>;
  removeAccounts!: Sequelize.HasManyRemoveAssociationsMixin<Accounts, AccountsId>;
  hasAccount!: Sequelize.HasManyHasAssociationMixin<Accounts, AccountsId>;
  hasAccounts!: Sequelize.HasManyHasAssociationsMixin<Accounts, AccountsId>;
  countAccounts!: Sequelize.HasManyCountAssociationsMixin;
  // Roles hasMany RolePermissions via role_id
  role_permissions!: RolePermissions[];
  getRole_permissions!: Sequelize.HasManyGetAssociationsMixin<RolePermissions>;
  setRole_permissions!: Sequelize.HasManySetAssociationsMixin<RolePermissions, RolePermissionsId>;
  addRole_permission!: Sequelize.HasManyAddAssociationMixin<RolePermissions, RolePermissionsId>;
  addRole_permissions!: Sequelize.HasManyAddAssociationsMixin<RolePermissions, RolePermissionsId>;
  createRole_permission!: Sequelize.HasManyCreateAssociationMixin<RolePermissions>;
  removeRole_permission!: Sequelize.HasManyRemoveAssociationMixin<RolePermissions, RolePermissionsId>;
  removeRole_permissions!: Sequelize.HasManyRemoveAssociationsMixin<RolePermissions, RolePermissionsId>;
  hasRole_permission!: Sequelize.HasManyHasAssociationMixin<RolePermissions, RolePermissionsId>;
  hasRole_permissions!: Sequelize.HasManyHasAssociationsMixin<RolePermissions, RolePermissionsId>;
  countRole_permissions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Roles {
    return Roles.init({
    role_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    ref_name: {
      type: DataTypes.STRING(254),
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
    tableName: 'roles',
    timestamps: false
  });
  }
}
