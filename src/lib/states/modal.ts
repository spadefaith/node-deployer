import { signal } from '@preact/signals-core';

export const reload = signal(false);
export const toggleModal = (value?) => {
	reload.value = value != undefined ? value : !reload.value;

	if (reload.value) {
		setTimeout(() => (reload.value = false), 150);
	}
};
