import Sequelize from "sequelize";


const env = import.meta.env.VITE_NODE_ENV;

import conf from "../../../db/config/config.mjs";


import { initModels } from "./init-models";
const config = conf[env];

// console.log(11, config);
//@ts-ignore
const sequelize = new Sequelize(
  //@ts-ignore
  config.database,
  config.username,
  config.password,
  config
);

const Models = initModels(sequelize);

export default Models;
