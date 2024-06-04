<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { tableSettings, icons } from '$lib/const/table';
	import { showSimpleToast } from '$lib/utils/toast';

	import { tabulator, moment } from '$lib';

	import * as tableState from '$lib/states/table';

	export let props = {} as any;

	let tableRef;
	let tableInstanceRef;
	const filterData = {};

	const Actions = (props: any) => {
		return /*html */ `
		<div class="flex">
			${props.options
				.map((item, key) => {
					if (item.type == 'switch') {
						return /*html */ `
								<span class="px-2" key=${item.value}-key>
								<a class="cursor-pointer action-item has-text-link-dark" data-type=${item.value}>
								<div class="form-check form-switch">
									<input
									class="form-check-input"
									type="checkbox"
									data-role="switch"
									id=${item.ref}
									/>
									<label class="form-check-label">${item.label}</label>
								</div>
								</a>
							</span>
							`;
					}
					return /*html */ `<span class="mx-1" key=${item.value}-key>
							<a class="cursor-pointer action-item has-text-link-dark" data-type=${item.value}>
							<img
								src=${props.icons[item.value]}
								style="width:15px"
								class=${item.label == '' ? 'icon-only' : ''} ${
									props.icons[item.value].includes('icon-plus') ? 'custom-plus-icon' : ''
								}
							/>
							<span >${item.label}</span>
							</a>
						</span>&nbsp;`;
				})
				.join('')}
		</div>
		`;
	};

	onMount(() => {
		let columns = props.column;

		columns = columns.map((item) => {
			if (item.field == 'actions') {
				const options = item.options || [];
				item.width = item.width || options.length * 90 || 100;
				const actionsTemplate = Actions({ options, icons: icons });
				const type = item.type;
				item = {
					...item,
					...{
						formatter: (cell, fr, onRendered) => {
							onRendered(() => {
								const celEl = cell.getElement();
								const row = cell.getRow();
								const data = row.getData();
								const hasSwitch = options.some((item) => type == 'switch');
								if (hasSwitch) {
									const switchs = celEl.querySelectorAll('[data-role=switch]');
									switchs.forEach((element) => {
										const id = element.id;
										const val = data[id];
										if (!(val == false || val == true)) {
											throw new Error('switch should have boolean value');
										}
										if (val) {
											element.setAttribute('checked', true);
										} else if (!val) {
											element.removeAttribute('checked');
										}
									});
								}
								celEl.style.padding = 'unset';
							});
							return actionsTemplate;
						},
						hozAlign: 'center'
					}
				};
			}

			// console.log(97, item);
			// item.height && (item.rowHeight = item.height);
			return item;
		});

		// console.log(103, columns);

		const config = {
			...(props.tableSettings ? { ...tableSettings, ...props.tableSettings } : tableSettings),
			// autoColumns: false,
			columns,
			ajaxURL: 'http://www.getmydata.com/now',
			ajaxResponse: (url, params, response) => {
				if (!response.status && response.message) {
					showSimpleToast({ message: response.message });
				}
				if (response.status) {
					response.data.data = response.data.data.map((item) => {
						return Object.keys(item).reduce((accu, key) => {
							if (key && ['created_dt', 'modified_dt'].includes(key) && item[key]) {
								//@ts-ignore
								item[key] = moment(item[key]).format('YYYY-MM-DD HH-mm-ss');
							}
							accu[key] = item[key];
							return accu;
						}, {});
					});
					if (props?.isFromSearch && !response.data.data.length) {
						showSimpleToast({ message: 'no record found', displayMode: 2 });
					}
					return response.data;
				} else {
					if (props?.isFromSearch.value && !response.data.length) {
						showSimpleToast({ message: 'no record found' });
					}
					return {
						last_page: 1,
						page: params.page,
						data: []
					};
				}
			},
			ajaxRequestFunc: async function (url, config, params) {
				delete params.filter;
				const datas = await props.paginateHandler({ ...params, ...filterData });

				if (!datas.status) {
					return { data: [] };
				}
				return datas;
			},
			rowFormatter: function (row) {
				// row.getElement().setAttribute('data-id', row.getData().id);
			},
			paginationCounter: function (pageSize, currentRow, currentPage, totalRows, totalPages) {
				return `<div>Showing ${currentPage}-${totalPages} of ${totalRows}</div>`;
			},
			dataLoaderLoading: () => {
				return /*html */ `
					<div class="d-flex justify-content-center">
					<div class="spinner-border text-dark" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					</div>
				`;
			}
		};

		// console.log(159, config);
		const table = new tabulator(tableRef, config);
		table.on('dataLoaded', (data) => {
			setTimeout(() => {
				props.isFromSearch = false;
				props.isLoading = false;
			}, 100);
			console.log('data is loaded');
		});
		table.on('rowSelectionChanged', (e) => console.log('selection changed'));
		table.on('rowClick', (e, _row) => {
			const target = e.target;
			const button = target.closest('A');
			const isSwitch =
				target.tagName == 'INPUT' && target.type == 'checkbox' && target.dataset.role == 'switch';
			if (button && props.rowActionHandler) {
				const data = _row.getData();
				isSwitch && (data._switch = target.checked);
				props.rowActionHandler({
					action: button.dataset.type,
					data: data ? { ...data } : {}
				});
			}
		});
		table.on('rowMoved', function (row) {
			props.rowMoved && props.rowMoved(row.getTable().getData());
		});

		tableInstanceRef = table;
		tableState.reload.subscribe((e) => {
			e && tableInstanceRef && tableInstanceRef.setData();
		});

		// Subscribe(
		// 	'onDataReload',
		// 	(e) => {
		// 		tableInstanceRef && tableInstanceRef.setData();
		// 	},
		// 	true
		// );
	});
</script>

<div>
	<div bind:this={tableRef} class="table-container"></div>
</div>

<style lang="scss">
	.table-container {
		overflow: auto;
	}
</style>
