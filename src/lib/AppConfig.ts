import 'dotenv/config';
const AppConfig = {
	NODE_ENV: import.meta.env.VITE_NODE_ENV,
	HOOK_BASE_URL: import.meta.env.VITE_HOOK_BASE_URL,
	IS_BUILD: import.meta.env.VITE_IS_BUILD,
	PWD: process.env.PWD
};
export default AppConfig;
