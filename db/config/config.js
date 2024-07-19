import 'dotenv/config';
import path from 'node:path';

let p = '../database';

const DB_PATH = path.join(
	__dirname,
	p,
	`${process.env.DB_FILE ? process.env.DB_FILE : `db_${process.env.NODE_ENV}.sqlite`}`
);
module.exports = {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	storage: DB_PATH,
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	logging: console.log
};

process.env.DB_PATH = DB_PATH;
