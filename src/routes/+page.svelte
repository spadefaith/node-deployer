<script lang="ts">
	import { bootstrap } from '$lib';
	import InputDynamicOne from '$lib/components/InputDynamicOne.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import Table from '$lib/components/Table.svelte';
	import FormControls from '$lib/components/form/FormControls.svelte';
	import * as tableState from '../lib/states/table';

	import type { AppsAttributes } from '$lib/models/Apps';
	import { showSimpleToast } from '$lib/utils/toast';
	import { Fetch, createUrl, getFormData } from '$lib/utils/utils';
	import {
		Row,
		Col,
		Button,
		Container,
		Nav,
		NavItem,
		NavLink,
		InputGroup,
		Input
	} from '@sveltestrap/sveltestrap';
	import NavBar from '$lib/components/NavBar.svelte';
	export let data: {
		apps: AppsAttributes[];
	} = {} as any;

	$: modalTitle = 'Create Apps';
	$: appId = '';
	$: isLoading = false;
	$: controls = [];
	$: modalRef = null;
	$: formMode = 'add';

	const showAddForm = () => {
		formMode = 'add';
		controls = [
			{
				display: 'Name',
				name: 'name',
				placeholder: 'name',
				tag: 'input',
				type: 'text',
				label: true,
				validator: 'required=true'
			},
			{
				display: 'Branch',
				name: 'branch',
				placeholder: 'branch',
				tag: 'input',
				type: 'text',
				label: true,
				validator: 'required=true'
			},
			{
				display: 'Repo',
				name: 'repo',
				placeholder: 'repo',
				tag: 'textarea',
				type: 'text',
				label: true,
				validator: 'required=true'
			},
			{
				display: 'Provider',
				name: 'provider',
				placeholder: 'provider',
				tag: 'select',
				label: true,
				options: [
					{
						display: 'GITHUB',
						value: 'github'
					},
					{
						display: 'BITBUCKET',
						value: 'bitbucket'
					},
					{
						display: 'GITLAB',
						value: 'gitlab'
					}
				],
				validator: 'required=true'
			},
			{
				display: 'Environment Variables',
				tag: 'text'
			},
			{
				display: 'Env',
				name: 'env',
				placeholder: 'env',
				tag: 'input-dynamic-one',
				type: 'text',
				label: false,
				validator: 'required=true'
			}
		];

		openModal();
	};

	const showEditForm = async (data) => {
		formMode = 'edit';

		const envs = await Fetch(createUrl(`${location.origin}/api/app/env`, { app_id: data.app_id }), {
			method: 'GET'
		});
		controls = [
			{
				display: 'App ID',
				tag: 'input',
				type: 'hidden',
				name: 'app_id',
				value: data.app_id
			},
			{
				display: 'Webhook URL',
				name: 'webhook_url',
				placeholder: 'webhook url',
				tag: 'input',
				type: 'text',
				label: true,
				validator: 'required=true',
				value: data.webhook_url || null
			},
			{
				display: 'Environment Variables',
				tag: 'text'
			},
			{
				display: 'Env',
				name: 'env',
				placeholder: 'env',
				tag: 'input-dynamic-one',
				type: 'text',
				label: false,
				validator: 'required=true',
				options: envs.status ? envs.data : []
			}
		];

		openModal();
	};

	const openModal = () => {
		const el: any = document.getElementById('exampleModal');
		modalRef = new bootstrap.Modal(el, {});
		modalRef.show();

		if (!el.hasEvent) {
			el.addEventListener('hidden.bs.modal', function (event) {
				controls = [];
			});
			el.hasEvent = true;
		}
	};

	const submitAddHandler = async (o) => {
		try {
			isLoading = true;

			const data = getFormData(o.target);

			const payload = Object.keys(data).reduce(
				(accu, key) => {
					if (key.includes('key_')) {
						const [k, index] = key.split('_');
						const v = data[`value_${index}`];

						accu.env[data[key]] = v;
					} else if (!key.includes('value_')) {
						accu[key] = data[key];
					}

					return accu;
				},
				{ env: {} }
			);

			const response = await Fetch('/api/app', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.status) {
				throw new Error(response.message);
			}

			console.log(75, response);

			isLoading = false;

			showSimpleToast({ title: 'Success', message: 'created successfully' });
			modalRef.hide();
			tableState.toggleReload(true);
		} catch (err) {
			isLoading = false;
			console.log(err);
			showSimpleToast({ title: 'Error', message: err.message });
		}
	};

	const submitEditHandler = async (o) => {
		try {
			isLoading = true;

			const data = getFormData(o.target);

			const payload = Object.keys(data).reduce(
				(accu, key) => {
					if (key.includes('key_')) {
						const [k, index] = key.split('_');
						const v = data[`value_${index}`];

						accu.env[data[key]] = v;
					} else if (!key.includes('value_')) {
						accu[key] = data[key];
					}

					return accu;
				},
				{ env: {} }
			);

			const response = await Fetch('/api/app', {
				method: 'PUT',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			console.log(75, response);

			if (!response.status) {
				throw new Error(response.message);
			}

			isLoading = false;

			showSimpleToast({ title: 'Success', message: 'created successfully' });
			modalRef.hide();
			tableState.toggleReload(true);
		} catch (err) {
			isLoading = false;
			console.log(err);
			showSimpleToast({ title: 'Error', message: err.message });
		}
	};

	const rowActionHandler = async (e) => {
		const { action, data } = e;
		if (action == 'edit') {
			modalTitle = 'Update Apps';

			showEditForm(data);
		} else if (action == 'delete') {
			try {
				isLoading = true;
				const response = await Fetch('/api/app', {
					method: 'DELETE',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ app_id: data.app_id })
				});

				isLoading = false;
				console.log(75, response);
				showSimpleToast({ title: 'Success', message: 'deleted successfully' });
				tableState.toggleReload(true);
			} catch (err) {
				isLoading = false;
				showSimpleToast({ title: 'Error', message: err.message });
				console.log(err);
			}
		} else if (action == 'redeploy') {
			try {
				isLoading = true;
				const url = createUrl(`${location.origin}/api/app/redeploy`, { app_id: data.app_id });
				const response = await Fetch(url, {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({})
				});

				isLoading = false;
				console.log(75, response);
				showSimpleToast({ title: 'Success', message: 'restarted successfully' });
				tableState.toggleReload(true);
			} catch (err) {
				isLoading = false;
				showSimpleToast({ title: 'Error', message: err.message });
				console.log(err);
			}
		}
	};

	const paginateHandler = async (e) => {
		try {
			const response = await Fetch(createUrl(`${location.origin}/api/app`, e), {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});

			return response;
		} catch (err) {
			isLoading = false;
			console.log(err);
		}
	};
</script>

<br />

<Container>
	<NavBar />
	<br />
	<Nav tabs={true}>
		<NavItem>
			<NavLink active={true}>Apps</NavLink>
		</NavItem>
	</Nav>
	<br />
	<br />
	<div>
		<Nav pills={true}>
			<NavItem>
				<button type="button" class="btn btn-dark" on:click={showAddForm}>
					<i class="bi bi-plus"></i> Add
				</button>
			</NavItem>
		</Nav>
	</div>
	<br />
	<br />

	<Table
		props={{
			column: [
				{ title: 'ID', field: 'app_id', visible: true },
				{ title: 'Name', field: 'name', visible: true },
				{ title: 'Branch', field: 'branch', visible: true },
				{
					title: 'Repo',
					field: 'repo',
					visible: true,
					width: 300,
					height: 400,
					variableHeight: true,
					formatter: 'textarea'
				},

				{
					title: 'Hook Url',
					field: 'webhook_url',
					visible: true,
					width: 300,
					height: 400,
					variableHeight: true,
					formatter: 'textarea'
				},
				{ title: 'Hooked Date', field: 'hooked_date', visible: true },
				{
					field: 'actions',
					title: 'Actions',
					visible: true,
					options: [
						{ value: 'redeploy', label: 'Restart' },
						{ value: 'edit', label: 'Update' },
						{ value: 'delete', label: 'Delete' }
					]
				}
			],
			rowActionHandler,
			paginateHandler
		}}
	></Table>

	<div
		class="modal fade"
		id="exampleModal"
		tabindex="-1"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true"
	>
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">{modalTitle}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
					></button>
				</div>
				<div class="modal-body">
					<form
						id="add-form"
						name="add-form"
						on:submit|preventDefault={formMode == 'add' ? submitAddHandler : submitEditHandler}
					>
						<FormControls props={{ data: controls }}></FormControls>

						<hr />
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="submit" form="add-form" class="btn btn-primary">Submit</button>
				</div>
			</div>
		</div>
	</div>

	{#if isLoading}
		<Loader />
	{/if}
</Container>

<style lang="scss">
	table {
		table-layout: fixed;
		// width: 100%;

		// td {
		// 	/* css-3 */
		// 	white-space: -o-pre-wrap;
		// 	word-wrap: break-word;
		// 	white-space: pre-wrap;
		// 	white-space: -moz-pre-wrap;
		// 	white-space: -pre-wrap;
		// }

		.wrappable {
			overflow: hidden;
			max-width: 400px;
			word-wrap: break-word;
		}
	}
</style>
