require('dotenv').config({});
const path = require('path');
const fs = require('fs');
const SequelizeAuto = require('sequelize-auto');

const Models = require('../models/index.js');

const rawConfig = require('../config/config.js');
const config = rawConfig[process.env.NODE_ENV];
const pathDir = path.join(__dirname, '../typed-models');

fs.rmSync(pathDir, { recursive: true, force: true });

//@ts-ignore
const auto = new SequelizeAuto(Models.sequelize, null, null, {
	...config,
	caseFile: 'p',
	caseModel: 'p',
	lang: 'ts',
	directory: path.join(__dirname, '../../src/lib/models')
});

auto.run();
