import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Permissions, PermissionsId } from './Permissions';
import type { Roles, RolesId } from './Roles';

export interface RolePermissionLinksAttributes {
  role_permission_link_id?: number;
  role_id?: number;
  permission_id?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;
}

export type RolePermissionLinksPk = "role_permission_link_id";
export type RolePermissionLinksId = RolePermissionLinks[RolePermissionLinksPk];
export type RolePermissionLinksOptionalAttributes = "role_permission_link_id" | "role_id" | "permission_id" | "created_by" | "modified_by" | "is_active" | "modified_dt" | "created_dt";
export type RolePermissionLinksCreationAttributes = Optional<RolePermissionLinksAttributes, RolePermissionLinksOptionalAttributes>;

export class RolePermissionLinks extends Model<RolePermissionLinksAttributes, RolePermissionLinksCreationAttributes> implements RolePermissionLinksAttributes {
  role_permission_link_id?: number;
  role_id?: number;
  permission_id?: number;
  created_by?: number;
  modified_by?: number;
  is_active?: number;
  modified_dt?: Date;
  created_dt?: Date;

  // RolePermissionLinks belongsTo Permissions via permission_id
  permission!: Permissions;
  getPermission!: Sequelize.BelongsToGetAssociationMixin<Permissions>;
  setPermission!: Sequelize.BelongsToSetAssociationMixin<Permissions, PermissionsId>;
  createPermission!: Sequelize.BelongsToCreateAssociationMixin<Permissions>;
  // RolePermissionLinks belongsTo Roles via role_id
  role!: Roles;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Roles>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Roles, RolesId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RolePermissionLinks {
    return RolePermissionLinks.init({
    role_permission_link_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'role_id'
      },
      unique: true
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'permissions',
        key: 'permission_id'
      },
      unique: true
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
    tableName: 'role_permission_links',
    timestamps: false,
    indexes: [
      {
        name: "role_permission_link_id",
        unique: true,
        fields: [
          { name: "role_permission_link_id" },
        ]
      },
      {
        name: "role_id_permission_id",
        unique: true,
        fields: [
          { name: "role_id" },
          { name: "permission_id" },
        ]
      },
    ]
  });
  }
}
