require('dotenv').config({});
const SequelizeAuto = require('sequelize-auto');
const path = require('path');
const shelljs = require('shelljs');

const config = require('../config/config.js');
const Models = require('../models/index.js');

/**@ts-ignore */
const auto = new SequelizeAuto(
	Models.sequelize,
	/**@ts-ignore */
	null,
	null,

	/**@ts-ignore */
	{
		...config,
		caseFile: 'p',
		caseModel: 'p',
		lang: 'ts',
		directory: path.join(__dirname, '../../src/lib/models')
	}
);

(async () => {
	try {
		await Models.sequelize.authenticate().then(function (errors) {
			errors ? console.log(errors) : console.log('database connected');
		});
		await Models.sequelize.sync({
			force: true
			// alter: true
		});

		await shelljs.exec(`npx sequelize-cli db:seed:all --env=${AppConfig.NODE_ENV}`);

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
