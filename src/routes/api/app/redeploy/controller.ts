import Models from '$lib/models';
import moment from 'moment';
import { redeploy } from '../controller';
import {
	getProvider,
	parseBitbucket,
	parseGithub,
	parseGitlab,
	parseJson
} from '$lib/utils/api-utils';

let queue = [];

export const redeployHandler = async (params: { app_id: string }, payload) => {
	const find = await Models.Apps.findOne({
		raw: true,
		where: {
			app_id: params.app_id
		}
	});

	if (!find) {
		throw new Error('app not found');
	}

	queue.push({
		...params,
		...find,
		payload
	});

	return true;
};

let id: any = '';
function interval() {
	id = setInterval(() => recurse(), 10000);
	console.log(`run the cron ${id}`);
}
interval();

function recurse() {
	const conf = queue[0] || {};
	queue = queue.slice(1, queue.length);

	const provider = conf.provider;

	if (conf.app_id) {
		let hookPayload: { branch: string; name: string; message: string } = {} as any;
		if (provider == 'github') {
			hookPayload = parseGithub(conf.payload);
		} else if (provider == 'gitlab') {
			hookPayload = parseGitlab(conf.payload);
		} else if (provider == 'bitbucket') {
			hookPayload = parseBitbucket(conf.payload);
		} else if (provider == 'json') {
			hookPayload = parseJson(conf.payload);
		}

		console.log(60, provider);
		console.log(61, hookPayload);
		console.log(62, conf);

		if (hookPayload.branch != conf.branch) {
			console.error(
				`skip not hook branch (${hookPayload.branch}) is not equal to app branch ${conf.payload}`
			);

			interval();

			return;
		}

		/**
		 * stop the cron
		 */
		console.log(`cron id ${id} has stopped`);
		clearInterval(id);

		redeploy(conf)
			.then(async (res) => {
				console.log(11, res);
				console.log(`stop execute ${conf.name}`);

				await Models.Apps.update(
					{
						hooked_date: moment()
					},
					{
						where: {
							app_id: conf.app_id
						}
					}
				);

				/**
				 * rerun the cron
				 */
				interval();
			})
			.catch((err) => {
				console.log(err);
				console.log(`failed execute ${conf.name}`);
				/**
				 * rerun the cron
				 */
				interval();
			});
	}
}
