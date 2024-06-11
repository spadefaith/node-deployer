import { json, type RequestHandler } from '@sveltejs/kit';
import { redeploy } from '../controller';

export const POST: RequestHandler = async (ctx) => {
	try {
		const appId = await ctx.url.searchParams.get('app_id');
		await redeploy({ app_id: appId });

		return json({ status: 1, data: true });
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};
