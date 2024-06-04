import { json, type RequestHandler } from '@sveltejs/kit';
import { appEnv, redeploy } from '../controller';

export const GET: RequestHandler = async (ctx) => {
	try {
		const appId = await ctx.url.searchParams.get('app_id');

		return json({ status: 1, data: await appEnv({ app_id: appId }) });
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};
