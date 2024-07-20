import Models from '$lib/models';
import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const rawCookies = event.cookies.getAll();

	const cookies = rawCookies.reduce((accu, iter) => {
		accu[iter.name] = iter.value;

		return accu;
	}, {});

	if (!cookies['x-token']) {
		return redirect(302, '/redirect?redirect_url=/logout');
	}

	try {
		const isVerified = jwt.verify(cookies['x-token'], 'deployer');

		if (!isVerified) {
			return redirect(302, '/redirect?redirect_url=/logout');
		}
	} catch (err) {
		console.log(27, err);
		return redirect(302, '/redirect?redirect_url=/logout');
	}

	return { apps: [] };
}) satisfies PageServerLoad;
