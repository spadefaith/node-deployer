import 'dotenv/config';
import path from 'node:path';
import Sequelize from 'sequelize';

import { initModels } from './init-models';

//@ts-ignore
const sequelize = new Sequelize(
	//@ts-ignore
	null,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		storage: path.join(process.env.PWD, `/db/database/${process.env.DB_FILE}`),
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT
	}
);

console.log(20, null, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	storage: path.join(process.env.PWD, `/db/database/${process.env.DB_FILE}`),
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT
});

const Models = initModels(sequelize);

export default Models;
