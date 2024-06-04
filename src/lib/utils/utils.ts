export const formControlWalker = (items, callback) => {
	const loop = (items, callback) =>
		Promise.all(
			JSON.parse(JSON.stringify(items)).map(async (item) => {
				const { relation, tag, options } = item;
				if (['group', 'row'].includes(tag)) {
					if (item.relation) {
						return callback({
							...item,
							children: await loop(
								(item.children || []).map((item) => {
									if (options && options[item.name]) {
										item.value = options[item.name];
									}

									return item;
								}),
								callback
							)
						});
					} else {
						return callback({
							...item,
							children: await loop(item.children || [], callback)
						});
					}
				}

				return callback(item);
			})
		);

	return loop(items, callback);
};

export const cloneObj = (obj) => {
	try {
		return JSON.parse(JSON.stringify(obj));
	} catch (err) {
		return obj;
	}
};

export function getFormData<T>(
	form: HTMLFormElement,
	opts?: { trim?: boolean; json?: boolean }
): T {
	const o = {
		trim: false,
		json: true
	};
	if (opts && opts.trim != undefined) {
		o.trim = opts.trim;
	}

	if (opts && opts.json != undefined) {
		o.json = opts.json;
	}

	const formData = new FormData(form);
	const data: any = {};
	const isTrim = o.trim;

	[...form.elements].forEach((item: any) => {
		const value = sanitize(item['value']);
		if (item['name']) {
			if (item['type'] == 'checkbox') {
				item['checked'] && (data[item['name']] = item['checked']);
			} else if (item['type'] == 'file') {
				console.log(item['files']);
				data[item['name']] = item['files'][0];
			} else if (isTrim && value != '') {
				data[item['name']] = value;
			} else if (!isTrim) {
				data[item['name']] = value;
			}
		}
	});

	delete data.PreventChromeAutocomplete;

	if (o.json == false) {
		Object.keys(data).forEach((key) => {
			if (!formData.has(key)) {
				formData.append(key, data[key]);
			}
		});

		return formData as T;
	}

	return data as T;
}

export const sanitize = (str) => decodeURIComponent(String(str).replace(/<.*>/, ''));

export const Fetch = async (url, conf) => {
	const response = await fetch(url, conf);
	let json: any = {};
	try {
		json = await response.json();
	} catch (err) {
		console.log(err);
	}
	if (!response.ok) {
		throw new Error(json.message || response.statusText);
	}

	return json;
};

export const createUrl = (url, params) => {
	const searchParams = new URLSearchParams();

	for (const key in params) {
		if (Object.prototype.hasOwnProperty.call(params, key)) {
			let val = params[key];

			if (typeof val != 'string') {
				val = JSON.stringify(val);
			}

			searchParams.append(key, val);
		}
	}

	if (url) {
		return `${url}?${searchParams.toString()}`;
	}
	return searchParams.toString();
};
