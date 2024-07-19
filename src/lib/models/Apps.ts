import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Envs, EnvsId } from './Envs';

export interface AppsAttributes {
  app_id?: number;
  webhook_url?: string;
  compose_path?: string;
  root_path?: string;
  repo?: string;
  branch?: string;
  name?: string;
  category?: string;
  status: number;
  created_by: string;
  modified_by: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;
  provider?: string;
}

export type AppsPk = "app_id";
export type AppsId = Apps[AppsPk];
export type AppsOptionalAttributes = "app_id" | "webhook_url" | "compose_path" | "root_path" | "repo" | "branch" | "name" | "category" | "status" | "created_by" | "modified_by" | "hooked_date" | "created_date" | "updated_date" | "provider";
export type AppsCreationAttributes = Optional<AppsAttributes, AppsOptionalAttributes>;

export class Apps extends Model<AppsAttributes, AppsCreationAttributes> implements AppsAttributes {
  app_id?: number;
  webhook_url?: string;
  compose_path?: string;
  root_path?: string;
  repo?: string;
  branch?: string;
  name?: string;
  category?: string;
  status!: number;
  created_by!: string;
  modified_by!: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;
  provider?: string;

  // Apps hasMany Envs via app_id
  envs!: Envs[];
  getEnvs!: Sequelize.HasManyGetAssociationsMixin<Envs>;
  setEnvs!: Sequelize.HasManySetAssociationsMixin<Envs, EnvsId>;
  addEnv!: Sequelize.HasManyAddAssociationMixin<Envs, EnvsId>;
  addEnvs!: Sequelize.HasManyAddAssociationsMixin<Envs, EnvsId>;
  createEnv!: Sequelize.HasManyCreateAssociationMixin<Envs>;
  removeEnv!: Sequelize.HasManyRemoveAssociationMixin<Envs, EnvsId>;
  removeEnvs!: Sequelize.HasManyRemoveAssociationsMixin<Envs, EnvsId>;
  hasEnv!: Sequelize.HasManyHasAssociationMixin<Envs, EnvsId>;
  hasEnvs!: Sequelize.HasManyHasAssociationsMixin<Envs, EnvsId>;
  countEnvs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Apps {
    return Apps.init({
    app_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    webhook_url: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    compose_path: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    root_path: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    repo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    category: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "SYS"
    },
    modified_by: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "SYS"
    },
    hooked_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'apps',
    timestamps: false,
    indexes: [
      {
        name: "apps_webhook_url_key",
        unique: true,
        fields: [
          { name: "webhook_url" },
        ]
      },
      {
        name: "apps_compose_path_key",
        unique: true,
        fields: [
          { name: "compose_path" },
        ]
      },
      {
        name: "apps_root_path_key",
        unique: true,
        fields: [
          { name: "root_path" },
        ]
      },
      {
        name: "name_branch_key",
        unique: true,
        fields: [
          { name: "name" },
          { name: "branch" },
        ]
      },
    ]
  });
  }
}
