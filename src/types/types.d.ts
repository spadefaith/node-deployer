export type AppModelSchema = {
	app_id?: number;
	branch: string;
	category_id?: number;
	compose_path: string;
	created_by?: string;
	modified_by?: string;
	name: string;
	repo: string;
	root_path: string;
	status?: number;
	webhook_url: string;
};
