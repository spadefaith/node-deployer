import { json, type RequestHandler } from '@sveltejs/kit';
import { create, paginate, remove, update } from './controller';
import { searchQueryToObj } from '$lib/utils/api-utils';
import { createValidation, updateValidation } from './validation';

export const GET: RequestHandler = async (ctx) => {
	try {
		const data = await paginate(searchQueryToObj(ctx.url.searchParams.toString()));

		return json({
			status: 1,
			data: data
		});
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};

export const POST: RequestHandler = async (ctx) => {
	try {
		const body = await ctx.request.json();

		await createValidation(body);

		const data = await create(body);

		return json({ status: 1, data: true });
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};

export const PUT: RequestHandler = async (ctx) => {
	try {
		const body = await ctx.request.json();

		await updateValidation(body);

		const data = await update(body);

		return json({ status: 1, data: true });
	} catch (err) {
		console.log(12, err);
		return json({ status: 0, message: err.message });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		const data = await remove(body);

		return json({ status: 1, data: data });
	} catch (err) {
		return json({ status: 0, message: err.message });
	}
};
