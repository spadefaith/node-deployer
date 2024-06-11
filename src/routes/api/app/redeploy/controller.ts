import Models from '$lib/models';
import moment from 'moment';
import { redeploy } from '../controller';

let queue = [];

export const redeployHandler = async (params: { app_id: string }) => {
	const find = await Models.Apps.findOne({
		raw: true,
		where: {
			app_id: params.app_id
		}
	});

	if (!find) {
		throw new Error('app not found');
	}

	queue.push(params);

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

	// console.log(111, `current cron id ${id}`, conf);

	if (conf.app_id) {
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
