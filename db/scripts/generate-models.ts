import SequelizeAuto from "sequelize-auto";
import path from "path";
import fs from "fs";
import shelljs from "shelljs";
// import { jsonSchemaToZod } from "json-schema-to-zod";
// import { toProper, parsedEntityJson } from "../utils";
import AppConfig from "../../AppConfig";

import rawConfig from "../config/config.mjs";
import Models from "../models";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = rawConfig[AppConfig.NODE_ENV];

// console.log(14, AppConfig.NODE_ENV, config);
// console.log(15, Models.sequelize);

// throw new Error("pause");

// console.log(22,path.join(__dirname, "../typed-models"))

/**@ts-ignore */
const auto = new SequelizeAuto(
  Models.sequelize,
  /**@ts-ignore */
  null,
  null,

  /**@ts-ignore */
  {
    ...config,
    caseFile: "p",
    caseModel: "p",
    lang: "ts",
    directory: path.join(__dirname, "../../src/lib/models"),
  }
);

(async () => {
  try {
    await Models.sequelize.authenticate().then(function (errors: any) {
      errors ? console.log(errors) : console.log("database connected");
    });
    await Models.sequelize.sync({
      force: true,
      // alter: true
    });

    await shelljs.exec(
      `npx sequelize-cli db:seed:all --env=${AppConfig.NODE_ENV}`
    );

    // const schemaRoot = path.resolve(__dirname, "../schemas");
    // fs.rmSync(schemaRoot, { recursive: true, force: true });
    // fs.mkdirSync(schemaRoot, { recursive: true });

    /**@ts-ignore */
    await auto.run().then((data) => {
      // Object.keys(data.tables).forEach((tbl) => {
      //   const tableName = tbl.split("_").reduce((accu, iter) => {
      //     accu += toProper(iter);
      //     return accu;
      //   }, "");
      //   const json = parsedEntityJson(data.tables[tbl]);
      //   const name = `${tableName}ModelSchema`;
      //   const schema = jsonSchemaToZod(json, { module: "esm" });
      //   // fs.writeFileSync(path.join(schemaRoot, `./${name}.ts`), schema);
      // });
    });
  } catch (err) {
    console.log(43, err);
  }
})();
