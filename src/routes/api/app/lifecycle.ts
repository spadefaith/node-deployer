import 'dotenv/config';

import shell from 'shelljs';
import path from 'node:path';
import fs from 'node:fs';
import { Loop, getProvider, toEnv } from '$lib/utils/api-utils';
import type { AppsAttributes, AppsCreationAttributes } from '$lib/models/Apps';
import workerpool from 'workerpool';
import Models from '$lib/models';

const PWD = process.env.PWD;
const pool = workerpool.pool(path.join(PWD, 'deploy.js'));

export type PayloadType = {
	name: string;
	env: {
		NODE_ENV: string;
		PORT: number;
	};
	branch: string;
	repo: string;
	provider?: string;
	persist: boolean;
	is_remove?: boolean;
	is_exist?: boolean;
};
export const beforeCreate = async (props: { data: PayloadType }) => {
	const data = props.data;
	const name = data.name;
	const appName = `${name}-${data.branch}`;

	const root = path.join(process.env.PWD, '../apps', `${appName}`);

	const isExist = data.is_exist != undefined ? data.is_exist : fs.existsSync(root);

	console.log(29, isExist, root);

	fs.rmSync(root, { recursive: true, force: true });
	fs.mkdirSync(root, { recursive: true });

	const provider = props?.data?.provider || getProvider(data.repo);

	props.data.provider = provider;

	return {
		data: {
			branch: data.branch,
			name: data.name,
			compose_path: root,
			root_path: root,
			repo: data.repo,
			is_exist: isExist,
			provider
		}
	};
};

export const afterCreate = async (props: {
	mutated: any;
	data: AppsCreationAttributes & { is_exist: boolean };
	payload: PayloadType;
}) => {
	const appId = props.mutated.app_id;
	const keys = Object.keys(props.payload.env);
	const { root_path, repo, branch, name, webhook_url, is_exist } = props.data;
	const envs = props.payload.env;
	if (keys.length) {
		const restruct = keys.map((key) => {
			return {
				prop_key: key,
				prop_value: props.payload.env[key],
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
	}

	await new Promise((res, rej) => {
		let error;

		process.chdir(PWD);
		pool
			.exec('deploy', [
				{
					root_path,
					branch,
					repo,
					envs
				}
			])
			.then(function (result) {
				console.log('Result: ' + result); // outputs 55
			})
			.catch(function (err) {
				error = err.message;
			})
			.then(function () {
				pool.terminate(); // terminate all workers when done
				if (error) {
					rej(error);
				} else {
					res(true);
				}
			});
	});

	return {
		...((await Models.Apps.findOne({
			raw: true,
			where: {
				app_id: appId
			}
		})) || {}),
		env: props?.payload?.env || {}
	};
};

export const beforeDelete = async (props: { app_id: number }) => {
	const find = await Models.Apps.findOne({
		raw: true,
		where: {
			app_id: props.app_id
		}
	});

	if (!find) {
		throw new Error('not found');
	}

	if (find) {
		try {
			/**
			 * down container
			 */
			shell.cd(find.root_path);

			const down = await shell.exec(`docker compose down`, {
				//@ts-ignore
				cwd: find.root_path
			});

			if (down.code !== 0) {
				throw new Error(down.stderr);
			}

			/**clean */
			await shell.exec('docker system prune -f');

			/** remove directory*/
		} catch (err) {
			console.log(153, err);
		}

		fs.rmSync(find.root_path, { recursive: true, force: true });

		shell.cd(PWD);
		process.chdir(PWD);
	}

	return find;
};

export const afterDelete = async (props: { app_id: number }) => {
	console.log(108, props);
};

export const beforeUpdate = async (props: { data: AppsAttributes & { provider: string } }) => {};
