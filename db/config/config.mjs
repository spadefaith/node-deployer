import AppConfig from '$lib/AppConfig';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let p = '../database';

if (AppConfig.IS_BUILD == 1) {
	p = '../../../db/database';
}

export default {
	development: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, p, 'db_dev.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	},
	staging: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, p, 'db_staging.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	},
	production: {
		username: 'root',
		password: 'root',
		storage: path.join(__dirname, p, 'db_prod.sqlite'),
		host: 'localhost',
		dialect: 'sqlite',
		logging: console.log
	}
};
