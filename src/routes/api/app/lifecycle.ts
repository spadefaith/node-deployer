import shell from 'shelljs';
import path from 'node:path';
import fs from 'node:fs';
import { Loop, getProvider, toEnv } from '$lib/utils/api-utils';
import AppConfig from '$lib/AppConfig';
import type { AppsCreationAttributes } from '$lib/models/Apps';
import Models from '$lib/models';
import { Op } from 'sequelize';
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

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
	is_remove: boolean;
};
export const beforeCreate = async (props: { data: PayloadType }) => {
	const data = props.data;
	const name = data.name;
	const appName = `${name}-${data.branch}`;

	let p = '../../../../../apps';
	if (AppConfig.IS_BUILD) {
		p = '../../../../apps';
	}

	const root = path.join(__dirname, `${p}/${appName}`);

	console.log(29, root);

	if (data.is_remove) {
		fs.rmSync(root, { recursive: true, force: true });
	}
	if (!fs.existsSync(root)) {
		fs.mkdirSync(root, { recursive: true });
	}

	const provider = getProvider(data.repo) || props?.data?.provider;

	props.data.provider = provider;

	return {
		data: {
			branch: data.branch,
			name: data.name,
			compose_path: root,
			root_path: root,
			repo: data.repo,
			webhook_url: `${AppConfig.HOOK_BASE_URL}/${provider}/${name}/${data.branch}`
		}
	};
};

export const afterCreate = async (props: {
	mutated: any;
	data: AppsCreationAttributes;
	payload: PayloadType;
}) => {
	const appId = props.mutated.app_id;
	const keys = Object.keys(props.payload.env);
	const { root_path, repo, branch, name, webhook_url } = props.data;
	const envs = props.payload.env;
	const content = await toEnv(envs);
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

	/**
	 * deploy
	 */
	shell.cd(root_path);
	const clone = shell.exec(`git clone --branch=${branch} ${repo} ${root_path} `);
	if (clone.code != 0) {
		console.log(`git clone --branch=${branch} ${repo} ${root_path} `);

		throw new Error(clone.stderr);
	}
	await fs.writeFileSync(`${root_path}/.env`, content);

	shell.exec('pwd');
	shell.exec('ls -alt');
	const deploy = await shell.exec(`docker compose down  && docker compose up --build -d `, {
		//@ts-ignore
		cwd: root_path,
		env: envs
	});

	if (deploy.code !== 0) {
		throw new Error(deploy.stderr);
	}

	/**clean */
	await shell.exec('docker system prune -f');

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
			fs.rmSync(find.root_path, { recursive: true, force: true });
		} catch (err) {
			console.log(153, err);
		}
	}

	return find;
};

export const afterDelete = async (props: { app_id: number }) => {
	console.log(108, props);
};
