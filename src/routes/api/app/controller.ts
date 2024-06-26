import AppConfig from '$lib/AppConfig';

import { getProvider, restructEnv, Loop } from '$lib/utils/api-utils';
import { toEnv } from '$lib/utils/api-utils';
import Models from '$lib/models';
import type { AppsAttributes, AppsCreationAttributes } from '$lib/models/Apps';
import shell from 'shelljs';
import path from 'node:path';
import fs from 'node:fs';
import { afterCreate, beforeCreate, beforeDelete, type PayloadType } from './lifecycle';
import LoopService from '$lib/services/LoopService';
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

export const create = async (data: PayloadType) => {
	const beforeCreateData: any = await beforeCreate({ data: data });

	const created = await Models.Apps.create(beforeCreateData.data);

	await Models.Apps.update(
		{
			webhook_url: `${AppConfig.HOOK_BASE_URL}/api/app/redeploy?app_id=${created.app_id}`
		},
		{
			where: {
				app_id: created.app_id
			}
		}
	);

	const afterCreateData = await afterCreate({
		mutated: created,
		data: beforeCreateData.data,
		payload: data
	});

	return afterCreateData;
};

export const remove = async (data: { app_id: number }) => {
	const beforeDeleteData: AppsAttributes = await beforeDelete(data);

	/**
	 * destroy env
	 */
	await Models.Envs.destroy({
		where: {
			app_id: beforeDeleteData.app_id
		}
	});

	/**
	 * destroy app
	 */
	await Models.Apps.destroy({
		where: {
			app_id: beforeDeleteData.app_id
		}
	});
};

export const paginate = async (params) => {
	const page = params.page;
	const limit = params.size;
	const offset = (page - 1) * limit;

	const query = await Models.Apps.findAndCountAll({
		raw: true,
		offset,
		limit,
		nest: true
	});

	return {
		last_page: Math.ceil(query.count / limit),
		last_row: query.count,
		page,
		data: query.rows
	};
};

export const redeploy = async (data: { app_id: string }) => {
	const find = await Models.Apps.findOne({
		raw: true,
		where: {
			app_id: data.app_id
		}
	});

	if (find) {
		const { root_path, branch, repo } = find;

		fs.rmSync(root_path, { recursive: true, force: true });
		fs.mkdirSync(root_path, { recursive: true });

		const envs = await restructEnv(find);
		const content = await toEnv(envs);
		shell.cd(root_path);
		const clone = shell.exec(`git clone --branch=${branch} ${repo} ${root_path} `);
		console.log('cloning repository');
		if (clone.code != 0) {
			console.log(`git clone --branch=${branch} ${repo} ${root_path} `);

			throw new Error(clone.stderr);
		}
		await fs.writeFileSync(`${root_path}/.env`, content);
		const deploy = await shell.exec(`docker compose down  && docker compose up --build -d `, {
			//@ts-ignore
			cwd: root_path,
			env: envs
		});

		if (deploy.code !== 0) {
			throw new Error(deploy.stderr);
		}

		await shell.exec('docker system prune -f');
	}
};

export const appEnv = async (data: { app_id: string }) => {
	return Models.Envs.findAll({
		raw: true,
		where: {
			app_id: data.app_id
		}
	});
};

export const update = async (data: PayloadType & { app_id: number; webhook_url: string }) => {
	const appId = data.app_id;
	const find = await Models.Apps.findOne({
		raw: true,
		where: {
			app_id: appId
		}
	});

	const { root_path } = find;
	const envs = data.env;
	const keys = Object.keys(envs);

	await Models.Apps.update(
		{
			webhook_url: data.webhook_url
		},
		{
			where: {
				app_id: appId
			}
		}
	);

	console.log(143, root_path);

	if (keys.length) {
		const content = await toEnv(envs);
		const restruct = keys.map((key) => {
			return {
				prop_key: key,
				prop_value: envs[key],
				app_id: appId
			};
		});

		/**destroy all */
		await Models.Envs.destroy({
			where: {
				app_id: appId
			}
		});

		await Models.Envs.bulkCreate(restruct);
		shell.cd(root_path);
		await fs.writeFileSync(`${root_path}/.env`, content);

		const deploy = await shell.exec(`docker compose down  && docker compose up --build -d `, {
			//@ts-ignore
			cwd: root_path,
			env: envs
		});

		if (deploy.code !== 0) {
			throw new Error(deploy.stderr);
		}
	}
};

export const bulkCreate = async (data: {
	name: string;
	env: string;
	branch: string;
	repo: string;
}) => {
	await LoopService(data, async (item, index) => {
		try {
			await create({
				name: item.name,
				env: item.env,
				branch: item.branch,
				repo: item.repo,
				persist: true
			});
		} catch (err) {
			console.log(171, item);
			console.log(172, err);
			return Promise.resolve({});
		}
	});
};
