import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	const url = event.url;
	const searchParams = url.searchParams;

	const redirectUrl = searchParams.get('redirect_url');

	throw redirect(302, redirectUrl);
}) satisfies PageServerLoad;
