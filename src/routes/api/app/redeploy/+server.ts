import { json, type RequestHandler } from '@sveltejs/kit';
import { redeploy } from '../controller';

export const POST: RequestHandler = async (ctx) => {
	try {
		const body = await ctx.request.json();

		await redeploy(body);

		return json({ status: 1, data: true });
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};
