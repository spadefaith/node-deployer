import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	const url = event.url;
	const searchParams = url.searchParams;

	const redirectUrl = searchParams.get('redirect_url');

	return redirect(307, redirectUrl);
}) satisfies PageServerLoad;
