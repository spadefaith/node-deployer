import Models from '$lib/models';
import type { BitbucketMergePayloadType } from '../../types/bitbucket-merge-payload';
import type { BitbucketPushPayloadType } from '../../types/bitbucket-push-payload';

export const parseBitbucket = (json) => {
	// console.log('parseBitbucket', JSON.stringify(json, null, 4));
	let branch, message, name, user;

	if (json.pullrequest) {
		const d = json as BitbucketMergePayloadType;

		branch = d?.pullrequest?.destination?.branch?.name;
		message = `merge to ${branch}`;
		name = d?.repository?.name;
		user = d?.actor?.display_name;
	} else if (json.push) {
		const d = json as BitbucketPushPayloadType;
		const changes = (d?.push?.changes || [])[0];

		if (changes) {
			branch = changes?.new?.name;
			message = changes?.new?.target?.message;
			name = d?.repository?.name;
			user = d?.actor?.display_name;
		}
	}

	// console.log('parsedBitbucket', JSON.stringify({ branch, message, name, user }, null, 4));

	return { branch, message, name, user };
};

export const parseGithub = (json) => {
	// console.log('parseGithub', JSON.stringify(json || {}, null, 4));
	let {
		ref,
		pusher: { name: username },
		repository: { name },
		commits: [{ message }]
	} = json;
	let branch = ref.split('/')[2];
	return { branch, name, message };
};

export const parseGitlab = (json) => {
	// console.log('parseGitlab', JSON.stringify(json || {}, null, 4));
	let {
		ref,
		user_username: name,
		commits: [{ message }]
	} = json;
	let branch = ref.split('/')[2];
	return { branch, name, message };
};

export const parseJson = (json) => {
	// console.log('parseJson', JSON.stringify(json || {}, null, 4));
	return {
		branch: json.branch,
		name: json.name,
		message: json.message
	};
};

export const getProvider = (repo) => {
	if (!repo) {
		return 'json';
	}
	if (repo.includes('bitbucket')) {
		return 'bitbucket';
	} else if (repo.includes('github')) {
		return 'github';
	} else if (repo.includes('gitlab')) {
		return 'gitlab';
	}
};

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

export const isPortFree = (port) =>
	new Promise((resolve) => {
		const server = require('http')
			.createServer()
			.listen(port, () => {
				server.close();
				resolve(true);
			})
			.on('error', () => {
				resolve(false);
			});
	});

export const extractAndDelete = (obj, props, def?) => {
	const r = obj[props];
	delete obj[props];

	return def ? r || def : r;
};

export const restructEnv = async (app) => {
	const findEvs = await Models.Envs.findAll({
		raw: true,
		where: {
			app_id: app.app_id
		}
	});

	if (!findEvs.length) {
		return {};
	}

	const restruct = await findEvs.reduce((accu, iter) => {
		accu[iter.prop_key] = iter.prop_value;
		return accu;
	}, {});

	return restruct;
};

export const Loop = async (array, callback) => {
	let l = array.length;
	let index = 0;
	let cache = [];
	return new Promise((res, rej) => {
		try {
			function recurse(callback) {
				if (index < l) {
					let item = array[index];
					callback(item, index)
						.then((result) => {
							index += 1;
							cache.push(result);

							recurse(callback);
						})
						.catch((err) => {
							rej(err);
						});
				} else {
					res(cache);
				}
			}
			recurse(callback);
		} catch (err) {
			rej(err);
		}
	});
};

export function searchQueryToObj<T>(str) {
	const url = `http://localhost:1000?${str}`;

	const urlObj = new URL(url);

	const obj = {};

	for (let [key, value] of urlObj.searchParams.entries()) {
		obj[key] = value;
	}

	return obj as T;
}
