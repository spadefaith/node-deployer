import { z } from 'zod';

export const bulkValidation = async (body) => {
	const schema = z.array(
		z.object({
			name: z.string(),
			env: z.any(),
			branch: z.string(),
			repo: z.string(),
			is_remove: z.boolean().optional(),
			is_exist: z.boolean().optional(),
			provider: z.string().optional()
		})
	);

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
