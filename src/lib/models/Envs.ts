import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Apps, AppsId } from './Apps';

export interface EnvsAttributes {
  env_id?: number;
  app_id?: number;
  prop_key?: string;
  prop_value?: string;
  status: number;
  created_by: string;
  modified_by: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;
}

export type EnvsPk = "env_id";
export type EnvsId = Envs[EnvsPk];
export type EnvsOptionalAttributes = "env_id" | "app_id" | "prop_key" | "prop_value" | "status" | "created_by" | "modified_by" | "hooked_date" | "created_date" | "updated_date";
export type EnvsCreationAttributes = Optional<EnvsAttributes, EnvsOptionalAttributes>;

export class Envs extends Model<EnvsAttributes, EnvsCreationAttributes> implements EnvsAttributes {
  env_id?: number;
  app_id?: number;
  prop_key?: string;
  prop_value?: string;
  status!: number;
  created_by!: string;
  modified_by!: string;
  hooked_date?: Date;
  created_date?: Date;
  updated_date?: Date;

  // Envs belongsTo Apps via app_id
  app!: Apps;
  getApp!: Sequelize.BelongsToGetAssociationMixin<Apps>;
  setApp!: Sequelize.BelongsToSetAssociationMixin<Apps, AppsId>;
  createApp!: Sequelize.BelongsToCreateAssociationMixin<Apps>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Envs {
    return Envs.init({
    env_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    app_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'apps',
        key: 'app_id'
      },
      unique: true
    },
    prop_key: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    prop_value: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
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
    }
  }, {
    sequelize,
    tableName: 'envs',
    timestamps: false,
    indexes: [
      {
        name: "envs_app_id_prop_key_prop_value_key",
        unique: true,
        fields: [
          { name: "app_id" },
          { name: "prop_key" },
          { name: "prop_value" },
        ]
      },
    ]
  });
  }
}
