import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async (event) => {
	event.cookies.delete('x-token', {
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
		secure: true
	});

	return redirect(302, '/redirect?redirect_url=/login');
}) satisfies PageServerLoad;
