import { z } from 'zod';

export const createValidation = async (body) => {
	const schema = z.object({
		name: z.string(),
		env: z.any(),
		branch: z.string(),
		repo: z.string(),
		is_remove: z.boolean().optional(),
		is_exist: z.boolean().optional(),
		provider: z.boolean().optional()
	});

	const validation = await schema.safeParseAsync(body);

	if (!validation.success) {
		const issues = validation.error.issues;
		const message = issues.reduce((accu, iter: any) => {
			const { code, expected, received, path, message } = iter;

			if (path.length) {
				path.forEach((item) => {
					accu += `${message} ${item}, `;
				});
			} else {
				accu += `${message} ,`;
			}

			return accu;
		}, '');
		console.error(issues);
		throw new Error(message || 'invalid validation');
	}
};

export const updateValidation = async (body) => {
	const schema = z.object({
		webhook_url: z.string(),
		env: z.any()
	});

	const validation = await schema.safeParseAsync(body);

	if (!validation.success) {
		const issues = validation.error.issues;
		const message = issues.reduce((accu, iter: any) => {
			const { code, expected, received, path, message } = iter;

			if (path.length) {
				path.forEach((item) => {
					accu += `${message} ${item}, `;
				});
			} else {
				accu += `${message} ,`;
			}

			return accu;
		}, '');
		console.error(issues);
		throw new Error(message || 'invalid validation');
	}
};
