export const tableSettings = {
	persistence: {
		// sort:true,
		// filter:true,
		// columns:true,
		page: {
			size: true, //persist the current page size
			page: true //do not persist the current page
		}
	},
	// headerVisible:false,
	columnDefaults: {
		tooltip: true
	}, //show tool tips on cells
	headerFilterLiveFilterDelay: 100, //wait 600ms from last keystroke before triggering filter
	index: 'id', //set the index of the data;
	// addRowPos:'top',
	reactiveData: true,
	// clipboard:true,
	// clipboardPasteAction:"replace",
	printAsHtml: true,
	// printStyled: true,
	printRowRange: 'selected',
	persistenceID: 'gateway',

	pagination: true, //enable pagination
	paginationMode: 'remote',
	paginationSize: 5,
	paginationSizeSelector: [5, 10, 25, 50],
	filterMode: 'remote',
	//load row data from array
	// layout: 'fitDataFill', //fit columns to width of table
	// responsiveLayout: 'collapse',

	addRowPos: 'top', //when adding a new row, add it to the top of the table
	// movableColumns: true, //allow column order to be changed
	// resizableRows: true //allow row order to be changed
	// initialSort:[             //set the initial sort order of the data
	//     {column:"_id", dir:"des"},
	// ],
	// autoColumns: true

	// height: '311px',
	layout: 'fitDataFill',
	responsiveLayout: 'collapse',
	rowHeader: {
		formatter: 'responsiveCollapse',
		width: 30,
		minWidth: 30,
		hozAlign: 'center',
		resizable: false,
		headerSort: false
	}
};

export const icons = {
	edit: '/assets/images/icon/edit.svg',
	delete: '/assets/images/icon/trash-2.svg',
	redeploy: '/assets/images/icon/download.svg',
	extract_caif: '/assets/images/icon/download.svg',
	extract_client_info: '/list.svg',
	extract_bos: '/assets/images/icon/download.svg',
	approve_lvl_1: '/assets/images/icon/check-circle.svg',
	approve_lvl_2: '/assets/images/icon/check-circle.svg',
	history: '/assets/images/icon/history.png',
	view: '/assets/images/icon/eye.svg',
	add_permission: '/assets/images/icon/file-plus.svg',
	add_billing: '/assets/images/icon/file-plus.svg',
	add_business_unit: '/assets/images/icon/file-plus.svg',
	add_control: '/assets/images/icon/file-plus.svg',
	add_process_rule: '/assets/images/icon/file-plus.svg',
	add_process: '/assets/images/icon/file-plus.svg',
	add_event: '/assets/images/icon/file-plus.svg',
	add_workflow: '/assets/images/icon/file-plus.svg',
	add_credentials: '/assets/images/icon/file-plus.svg'
};
