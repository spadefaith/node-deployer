import shell from 'shelljs';
import fs from 'node:fs';
import workerpool from 'workerpool';
const PWD = process.env.PWD;

export const escapeNewlines = (str) => {
	return str ? String(str).replace(/\n/g, '\\n') : '';
};
export const format = (key, value) => {
	return `${key}=${escapeNewlines(value)}`;
};
export const toEnv = (obj) => {
	const joined = Object.keys(obj)
		.map((key) => {
			const val = obj[key];
			return format(key, val);
		})
		.join('\n');

	return joined;
};
async function deploy(props) {
	try {
		const { root_path, branch, repo, envs } = props || {};

		const content = await toEnv(envs);
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

		shell.cd(PWD);
		process.chdir(PWD);
	} catch (err) {
		console.log(54, err);
		shell.cd(PWD);
		process.chdir(PWD);
	}
}

// console.log(49, workerData);
// deploy(workerData);

workerpool.worker({
	deploy: deploy
});
