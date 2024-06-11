import Models from '$lib/models/index.js';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { PageServerLoad } from './$types.js';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	login: async (event) => {
		try {
			const data = await event.request.formData();

			const username: string = data.get('username') as any;
			const password: string = data.get('password') as any;

			const find = await Models.Accounts.findOne({
				raw: true,
				where: {
					username: username
				}
			});

			if (!find) {
				throw new Error('account not found');
			}
			console.log(18, find);

			const compare = bcrypt.compareSync(password, find.password);

			if (!compare) {
				throw new Error('wrong password');
			}

			const token = jwt.sign({}, 'deployer', { expiresIn: `${15 * 60 * 1000}` });

			event.cookies.set('x-token', token, {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				secure: true
			});

			return redirect(302, '/redirect?redirect_url=/');
		} catch (err) {
			console.log(err);
			return fail(400, { message: err.message, error: true });
		}
	}
};
