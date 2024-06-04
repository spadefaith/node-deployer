import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	development: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, '../database', 'db_dev.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	},
	staging: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, '../database', 'db_staging.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	},
	production: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, '../database', 'db_prod.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	}
};
