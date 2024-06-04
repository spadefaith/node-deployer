"use strict";
import AppConfig from "../../AppConfig";
import fs from "fs";
import path from "node:path";
import Sequelize from "sequelize";
import rawConfig from "../config/config.mjs";
import { fileURLToPath } from "node:url";
const { Op, QueryTypes } = Sequelize;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const basename = path.basename(__filename);
const env = AppConfig.NODE_ENV;

const db = {};
let sequelize;
const config = rawConfig[env];

import AccountModel from "./AccountModel";
import PermissionModel from "./PermissionModel";
import RoleModel from "./RoleModel";
import RolePermissionModel from "./RolePermissionModel";
import AppModel from "./AppModel";
import EnvModel from "./EnvModel";

const models = {
  AccountModel,
  PermissionModel,
  RoleModel,
  RolePermissionModel,
  AppModel,
  EnvModel,
};

Object.keys(models).forEach((fileName) => {
  const file = models[fileName];

  if (!sequelize) {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  db.RawQuery = (query, opts = {}) => {
    const options = {
      raw: true,
      type: QueryTypes.SELECT,
    };
    if (opts.logging) {
      options.logging = console.log;
    }
    if (opts.plain != undefined) {
      options.plain = opts.plain;
    }
    return sequelize.query(query, options);
  };

  const model = file(sequelize, Sequelize.DataTypes);
  model.modelName = fileName;
  model.RawQuery = db[fileName] = model;
  model.isExist = (query) => {
    return model.findOne({ raw: true, where: query });
  };

  db[fileName] = model;
});

Object.keys(db).forEach((file) => {
  if (db[file].associate) {
    db[file].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
