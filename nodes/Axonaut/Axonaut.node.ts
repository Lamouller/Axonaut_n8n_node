import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { axonautApiRequest, axonautApiRequestAllItems } from './GenericFunctions';

// Helper function to get resource lists for dynamic dropdowns
async function getResourceList(
	this: ILoadOptionsFunctions,
	endpoint: string,
	idField: string,
	nameField: string | string[],
	resourceType: string,
	filter?: string
): Promise<INodeListSearchResult> {
	try {
		const resources = await axonautApiRequest.call(this, 'GET', endpoint);

		const results: INodeListSearchResult = {
			results: [],
		};

		if (Array.isArray(resources)) {
			for (const resource of resources) {
				// Build display name
				let displayName = '';
				if (Array.isArray(nameField)) {
					displayName = nameField
						.map(field => resource[field] || '')
						.filter(value => value.trim() !== '')
						.join(' ');
				} else {
					displayName = resource[nameField] || '';
				}

				// Fallback if no name
				if (!displayName.trim()) {
					displayName = `${resourceType} ${resource[idField]}`;
				}

				// Apply filter if provided
				if (!filter || displayName.toLowerCase().includes(filter.toLowerCase())) {
					results.results.push({
						name: displayName,
						value: resource[idField].toString(),
					});
				}
			}

			// Sort results by name
			results.results.sort((a, b) => a.name.localeCompare(b.name));
		}

		return results;
	} catch (error) {
		// Return empty results on error
		return { results: [] };
	}
}

export class Axonaut implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Axonaut',
		name: 'axonaut',
		icon: 'file:axonaut.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Axonaut API - Complete coverage of all endpoints',
		defaults: {
			name: 'Axonaut',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'axonautApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Address',
						value: 'address',
					},
					{
						name: 'Bank Transaction',
						value: 'bank-transaction',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Contract (Order)',
						value: 'contract',
					},

					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Employee (Contact)',
						value: 'employee',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Expense Payment',
						value: 'expense-payment',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Invoice Payment',
						value: 'invoice-payment',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Quotation',
						value: 'quotation',
					},
					{
						name: 'Supplier',
						value: 'supplier',
					},
					{
						name: 'Supplier Contract',
						value: 'supplier-contract',
					},
					{
						name: 'Supplier Delivery',
						value: 'supplier-delivery',
					},
					{
						name: 'Diverse Operations',
						value: 'diverse-operations',
					},
					{
						name: 'Delivery Forms',
						value: 'delivery-forms',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Ticket',
						value: 'ticket',
					},
					{
						name: 'Timetracking',
						value: 'timetracking',
					},
					{
						name: 'Themes',
						value: 'theme',
					},
					{
						name: 'Bank Accounts',
						value: 'bank-account',
					},
					{
						name: 'Company Categories',
						value: 'company-category',
					},
					{
						name: 'Task Natures',
						value: 'task-nature',
					},
					{
						name: 'Project Natures',
						value: 'project-nature',
					},
					{
						name: 'Tax Rates',
						value: 'tax-rate',
					},
					{
						name: 'Accounting Codes',
						value: 'accounting-code',
					},
					{
						name: 'Languages',
						value: 'language',
					},
					{
						name: 'Workforces',
						value: 'workforce',
					},
					{
						name: 'Payslips',
						value: 'payslip',
					},
					{
						name: 'Pipes',
						value: 'pipe',
					},
					{
						name: 'Account',
						value: 'account',
					},
				],
				default: 'company',
			},

			// Company Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['company'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new company',
						action: 'Create a company',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a company by ID',
						action: 'Get a company',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all companies',
						action: 'Get many companies',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a company',
						action: 'Update a company',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a company',
						action: 'Delete a company',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Create or update a company based on unique identifier',
						action: 'Upsert a company',
					},
				],
				default: 'get',
			},

			// Employee Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['employee'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new employee',
						action: 'Create an employee',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an employee by ID',
						action: 'Get an employee',
					},
					{
						name: 'Get Company Employees',
						value: 'getCompanyEmployees',
						description: 'Get all employees of a specific company',
						action: 'Get company employees',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all employees',
						action: 'Get many employees',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an employee',
						action: 'Update an employee',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an employee',
						action: 'Delete an employee',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Create or update an employee based on email',
						action: 'Upsert an employee',
					},
				],
				default: 'get',
			},

			// Invoice Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an invoice by ID',
						action: 'Get an invoice',
					},
					{
						name: 'Get Company Invoices',
						value: 'getCompanyInvoices',
						description: 'Get all invoices of a specific company',
						action: 'Get company invoices',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all invoices',
						action: 'Get many invoices',
					},
				],
				default: 'get',
			},

			// Opportunity Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new opportunity',
						action: 'Create an opportunity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an opportunity by ID',
						action: 'Get an opportunity',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all opportunities',
						action: 'Get many opportunities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an opportunity',
						action: 'Update an opportunity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an opportunity',
						action: 'Delete an opportunity',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Create or update an opportunity based on name',
						action: 'Upsert an opportunity',
					},
					{
						name: 'Mark as Won',
						value: 'markWon',
						description: 'Register an opportunity as won',
						action: 'Mark opportunity as won',
					},
					{
						name: 'Mark as Lost',
						value: 'markLost',
						description: 'Register an opportunity as lost',
						action: 'Mark opportunity as lost',
					},
				],
				default: 'get',
			},

			// Product Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['product'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new product',
						action: 'Create a product',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a product by ID',
						action: 'Get a product',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all products',
						action: 'Get many products',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a product',
						action: 'Update a product',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a product',
						action: 'Delete a product',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Create or update a product based on unique identifier',
						action: 'Upsert a product',
					},
					{
						name: 'Get Stock',
						value: 'getStock',
						description: 'Get the stock of a product',
						action: 'Get product stock',
					},
					{
						name: 'Update Stock',
						value: 'updateStock',
						description: 'Update the stock of a product',
						action: 'Update product stock',
					},
				],
				default: 'get',
			},

			// Quotation Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['quotation'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new quotation',
						action: 'Create a quotation',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a quotation by ID',
						action: 'Get a quotation',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all quotations',
						action: 'Get many quotations',
					},
					{
						name: 'Get Company Quotations',
						value: 'getCompanyQuotations',
						description: 'Get all quotations of a specific company',
						action: 'Get company quotations',
					},
				],
				default: 'get',
			},

			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new project',
						action: 'Create a project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project by ID',
						action: 'Get a project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all projects',
						action: 'Get many projects',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a project',
						action: 'Update a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete a project',
					},
					{
						name: 'Upsert',
						value: 'upsert',
						description: 'Create or update a project based on unique identifier',
						action: 'Upsert a project',
					},
				],
				default: 'get',
			},

			// Expense Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['expense'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an expense by ID',
						action: 'Get an expense',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all expenses',
						action: 'Get many expenses',
					},
					{
						name: 'Create Payment',
						value: 'createPayment',
						description: 'Create an expense payment',
						action: 'Create expense payment',
					},
				],
				default: 'get',
			},

			// Event Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['event'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new event',
						action: 'Create an event',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an event by ID',
						action: 'Get an event',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all events',
						action: 'Get many events',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an event',
						action: 'Update an event',
					},
					{
						name: 'Get Company Events',
						value: 'getCompanyEvents',
						description: 'Get all events of a specific company',
						action: 'Get company events',
					},
					{
						name: 'Send Email',
						value: 'send',
						description: 'Send an event as email',
						action: 'Send event email',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an event',
						action: 'Delete an event',
					},
				],
				default: 'get',
			},

			// Address Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['address'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new address',
						action: 'Create a address',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a address by ID',
						action: 'Get a address',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all addresses of a company',
						action: 'Get all addresses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a address',
						action: 'Update a address',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a address',
						action: 'Delete a address',
					},
				],
				default: 'getAll',
			},

			// Bank transaction Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bank-transaction'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a bank transaction by ID',
						action: 'Get a bank transaction',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all bank transactions',
						action: 'Get many bank transactions',
					},
				],
				default: 'getAll',
			},

			// Contract Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contract'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contract',
						action: 'Create a contract',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contract by ID',
						action: 'Get a contract',
					},
					{
						name: 'Get Company Contracts',
						value: 'getCompanyContracts',
						description: 'Get all contracts of a specific company',
						action: 'Get company contracts',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all contracts',
						action: 'Get many contracts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contract',
						action: 'Update a contract',
					},
				],
				default: 'get',
			},





			// Document Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new document',
						action: 'Create a document',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document by ID',
						action: 'Get a document',
					},
					{
						name: 'Get Company Documents',
						value: 'getCompanyDocuments',
						description: 'Get all documents of a specific company',
						action: 'Get company documents',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a document',
						action: 'Update a document',
					},
					{
						name: 'Download',
						value: 'download',
						description: 'Download a document file',
						action: 'Download a document',
					},
				],
				default: 'get',
			},

			// Expense payment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['expense-payment'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new expense payment',
						action: 'Create a expense payment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an expense payment by ID',
						action: 'Get an expense payment',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all expense payments',
						action: 'Get many expense payments',
					},
				],
				default: 'create',
			},

			// Invoice payment Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice-payment'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new invoice payment',
						action: 'Create a invoice payment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an invoice payment by ID',
						action: 'Get an invoice payment',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all invoice payments',
						action: 'Get many invoice payments',
					},
				],
				default: 'create',
			},

			// Supplier Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['supplier'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new supplier',
						action: 'Create a supplier',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a supplier by ID',
						action: 'Get a supplier',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all suppliers',
						action: 'Get many suppliers',
					},
				],
				default: 'get',
			},

			// Supplier contract Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['supplier-contract'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new supplier contract',
						action: 'Create a supplier contract',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a supplier contract by ID',
						action: 'Get a supplier contract',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all supplier contracts',
						action: 'Get many supplier contracts',
					},
				],
				default: 'get',
			},



			// Task Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new task',
						action: 'Create a task',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a task by ID',
						action: 'Get a task',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all tasks',
						action: 'Get many tasks',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a task',
						action: 'Delete a task',
					},
				],
				default: 'get',
			},

			// Ticket Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new ticket',
						action: 'Create a ticket',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a ticket by ID',
						action: 'Get a ticket',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all tickets',
						action: 'Get many tickets',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a ticket',
						action: 'Update a ticket',
					},
				],
				default: 'get',
			},

			// Supplier Delivery Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['supplier-delivery'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a supplier delivery by ID',
						action: 'Get a supplier delivery',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all supplier deliveries',
						action: 'Get many supplier deliveries',
					},
					{
						name: 'Create Receipt',
						value: 'createReceipt',
						description: 'Receive merchandise for a supplier delivery',
						action: 'Create delivery receipt',
					},
					{
						name: 'Delete Receipt',
						value: 'deleteReceipt',
						description: 'Delete a merchandise receipt',
						action: 'Delete delivery receipt',
					},
				],
				default: 'getAll',
			},

			// Diverse Operations Operations  
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['diverse-operations'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a diverse operation by ID',
						action: 'Get a diverse operation',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all diverse operations',
						action: 'Get many diverse operations',
					},
				],
				default: 'getAll',
			},

			// Delivery Forms Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['delivery-forms'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a delivery note from an invoice',
						action: 'Create a delivery note',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a delivery note by ID',
						action: 'Get a delivery note',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all delivery notes',
						action: 'Get many delivery notes',
					},
					{
						name: 'Download',
						value: 'download',
						description: 'Download a delivery note',
						action: 'Download delivery note',
					},
				],
				default: 'getAll',
			},

			// Timetracking Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timetracking'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new timetracking',
						action: 'Create a timetracking',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a timetracking by ID (client-side filtered)',
						action: 'Get a timetracking',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all timetrackings',
						action: 'Get many timetrackings',
					},
					{
						name: 'Get Task Timetrackings',
						value: 'getTaskTimetrackings',
						description: 'Get timetrackings on a specific task',
						action: 'Get task timetrackings',
					},
					{
						name: 'Get Ticket Timetrackings',
						value: 'getTicketTimetrackings',
						description: 'Get timetrackings on a specific ticket',
						action: 'Get ticket timetrackings',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a timetracking',
						action: 'Delete a timetracking',
					},
				],
				default: 'create',
			},

			// Themes Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['theme'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a theme by ID',
						action: 'Get a theme',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all themes',
						action: 'Get many themes',
					},
				],
				default: 'get',
			},

			// Bank Accounts Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bank-account'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a bank account by ID',
						action: 'Get a bank account',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all bank accounts',
						action: 'Get many bank accounts',
					},
				],
				default: 'get',
			},

			// Company Categories Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['company-category'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new company category',
						action: 'Create a company category',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a company category by ID',
						action: 'Get a company category',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all company categories',
						action: 'Get many company categories',
					},
				],
				default: 'get',
			},

			// Task Natures Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task-nature'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a task nature by ID',
						action: 'Get a task nature',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all task natures',
						action: 'Get many task natures',
					},
				],
				default: 'get',
			},

			// Project Natures Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project-nature'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project nature by ID',
						action: 'Get a project nature',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all project natures',
						action: 'Get many project natures',
					},
				],
				default: 'get',
			},

			// Tax Rates Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tax-rate'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a tax rate by ID',
						action: 'Get a tax rate',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all tax rates',
						action: 'Get many tax rates',
					},
				],
				default: 'get',
			},

			// Accounting Codes Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['accounting-code'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new accounting code',
						action: 'Create an accounting code',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an accounting code by ID',
						action: 'Get an accounting code',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all accounting codes',
						action: 'Get many accounting codes',
					},
				],
				default: 'get',
			},

			// Languages Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['language'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a language by ID',
						action: 'Get a language',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all languages',
						action: 'Get many languages',
					},
				],
				default: 'get',
			},

			// Workforces Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workforce'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a workforce by ID',
						action: 'Get a workforce',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all workforces',
						action: 'Get many workforces',
					},
				],
				default: 'getAll',
			},

			// Payslips Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payslip'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a payslip by ID',
						action: 'Get a payslip',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all payslips',
						action: 'Get many payslips',
					},
				],
				default: 'get',
			},

			// Pipes Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pipe'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a pipe by ID',
						action: 'Get a pipe',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all pipes',
						action: 'Get many pipes',
					},
				],
				default: 'get',
			},

			// Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get Current User',
						value: 'getCurrentUser',
						description: 'Get current user information',
						action: 'Get current user',
					},
					{
						name: 'Get Users',
						value: 'getUsers',
						description: 'Get all users of the account',
						action: 'Get all users',
					},
					{
						name: 'Get Custom Fields',
						value: 'getCustomFields',
						description: 'Get all custom fields of the account',
						action: 'Get custom fields',
					},
					{
						name: 'Get Credits History',
						value: 'getCreditsHistory',
						description: 'Get credits history of the account',
						action: 'Get credits history',
					},
				],
				default: 'getCurrentUser',
			},

			// Task ID for timetracking operations
			{
				displayName: 'Task',
				name: 'taskId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['timetracking'],
						operation: ['getTaskTimetrackings'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a task...',
						typeOptions: {
							searchListMethod: 'getTasks',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The task to get timetrackings for',
			},

			// Ticket ID for timetracking operations
			{
				displayName: 'Ticket',
				name: 'ticketId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['timetracking'],
						operation: ['getTicketTimetrackings'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a ticket...',
						typeOptions: {
							searchListMethod: 'getTickets',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The ticket to get timetrackings for',
			},

			// ID Fields for each resource
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['get', 'update', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to work with',
			},
			{
				displayName: 'Employee',
				name: 'employeeId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['get', 'update', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an employee...',
						typeOptions: {
							searchListMethod: 'getEmployees',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The employee to work with',
			},
			
			// Company ID for getCompanyEmployees operation
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['getCompanyEmployees'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to get employees for',
			},
			
			{
				displayName: 'Invoice',
				name: 'invoiceId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an invoice...',
						typeOptions: {
							searchListMethod: 'getInvoices',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The invoice to work with',
			},
			
			// Company ID for getCompanyInvoices operation
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['getCompanyInvoices'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to get invoices for',
			},
			
			{
				displayName: 'Opportunity',
				name: 'opportunityId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['get', 'update', 'delete', 'markWon', 'markLost'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an opportunity...',
						typeOptions: {
							searchListMethod: 'getOpportunities',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The opportunity to work with',
			},
			{
				displayName: 'Product',
				name: 'productId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['get', 'update', 'delete', 'getStock', 'updateStock'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a product...',
						typeOptions: {
							searchListMethod: 'getProducts',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The product to work with',
			},
			{
				displayName: 'Quotation',
				name: 'quotationId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['quotation'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a quotation...',
						typeOptions: {
							searchListMethod: 'getQuotations',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The quotation to work with',
			},
			{
				displayName: 'Project',
				name: 'projectId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'update', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a project...',
						typeOptions: {
							searchListMethod: 'getProjects',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The project to work with',
			},
			{
				displayName: 'Expense',
				name: 'expenseId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an expense...',
						typeOptions: {
							searchListMethod: 'getExpenses',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The expense to work with',
			},
			{
				displayName: 'Invoice Payment',
				name: 'invoicePaymentId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice-payment'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an invoice payment...',
						typeOptions: {
							searchListMethod: 'getInvoicePayments',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The invoice payment to work with',
			},
			{
				displayName: 'Expense Payment',
				name: 'expensePaymentId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['expense-payment'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an expense payment...',
						typeOptions: {
							searchListMethod: 'getExpensePayments',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The expense payment to work with',
			},
			{
				displayName: 'Bank Transaction',
				name: 'bankTransactionId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['bank-transaction'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a bank transaction...',
						typeOptions: {
							searchListMethod: 'getBankTransactions',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The bank transaction to work with',
			},
			{
				displayName: 'Event',
				name: 'eventId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'update', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an event...',
						typeOptions: {
							searchListMethod: 'getEvents',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The event to work with',
			},

			// Workforce ID for workforce operations
			{
				displayName: 'Workforce',
				name: 'workforceId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['workforce'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workforce...',
						typeOptions: {
							searchListMethod: 'getWorkforces',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The workforce to work with',
			},

			// Delivery Form ID for delivery-forms operations
			{
				displayName: 'Delivery Form',
				name: 'deliveryFormId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['delivery-forms'],
						operation: ['get', 'download'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a delivery form...',
						typeOptions: {
							searchListMethod: 'getDeliveryForms',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The delivery form to work with',
			},

			// Receipt ID for supplier delivery receipt operations
			{
				displayName: 'Receipt ID',
				name: 'receiptId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['supplier-delivery'],
						operation: ['deleteReceipt'],
					},
				},
				description: 'The receipt ID to delete',
			},

			// Supplier Delivery ID for supplier-delivery operations
			{
				displayName: 'Supplier Delivery',
				name: 'supplierDeliveryId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['supplier-delivery'],
						operation: ['get', 'createReceipt', 'deleteReceipt'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a supplier delivery...',
						typeOptions: {
							searchListMethod: 'getSupplierDeliveries',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The supplier delivery to work with',
			},

			{
				displayName: 'Address',
				name: 'addressId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['address'],
						operation: ['get', 'update', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a address...',
						typeOptions: {
							searchListMethod: 'getAddresss',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The address to work with',
			},

			// Company ID for address getAll operation  
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['address'],
						operation: ['getAll', 'get', 'create'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to get addresses for',
			},

			{
				displayName: 'Contract',
				name: 'contractId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['get', 'update'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a contract...',
						typeOptions: {
							searchListMethod: 'getContracts',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The contract to work with',
			},
			
			// Company ID for getCompanyContracts operation
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['getCompanyContracts'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to get contracts for',
			},

			{
				displayName: 'Document',
				name: 'documentId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'update', 'download'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a document...',
						typeOptions: {
							searchListMethod: 'getDocuments',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The document to work with',
			},
			
			// Company ID for getCompanyDocuments operation
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['getCompanyDocuments'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company to get documents for',
			},



			{
				displayName: 'Supplier',
				name: 'supplierId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['supplier'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a supplier...',
						typeOptions: {
							searchListMethod: 'getSuppliers',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The supplier to work with',
			},

			{
				displayName: 'Supplier contract',
				name: 'suppliercontractId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['supplier-contract'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a supplier contract...',
						typeOptions: {
							searchListMethod: 'getSupplierContracts',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The supplier contract to work with',
			},



			{
				displayName: 'Task',
				name: 'taskId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['get', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a task...',
						typeOptions: {
							searchListMethod: 'getTasks',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The task to work with',
			},

			{
				displayName: 'Ticket',
				name: 'ticketId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['get', 'update'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a ticket...',
						typeOptions: {
							searchListMethod: 'getTickets',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The ticket to work with',
			},

			{
				displayName: 'Timetracking',
				name: 'timetrackingId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['timetracking'],
						operation: ['get', 'delete'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a timetracking...',
						typeOptions: {
							searchListMethod: 'getTimetrackings',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The timetracking to work with',
			},

			// Theme ID for theme operations
			{
				displayName: 'Theme',
				name: 'themeId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['theme'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a theme...',
						typeOptions: {
							searchListMethod: 'getThemes',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The theme to work with',
			},

			// Bank Account ID for bank-account operations
			{
				displayName: 'Bank Account',
				name: 'bankAccountId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['bank-account'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a bank account...',
						typeOptions: {
							searchListMethod: 'getBankAccounts',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The bank account to work with',
			},

			// Company Category ID for company-category operations
			{
				displayName: 'Company Category',
				name: 'companyCategoryId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['company-category'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company category...',
						typeOptions: {
							searchListMethod: 'getCompanyCategories',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company category to work with',
			},

			// Task Nature ID for task-nature operations
			{
				displayName: 'Task Nature',
				name: 'taskNatureId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['task-nature'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a task nature...',
						typeOptions: {
							searchListMethod: 'getTaskNatures',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The task nature to work with',
			},

			// Project Nature ID for project-nature operations
			{
				displayName: 'Project Nature',
				name: 'projectNatureId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['project-nature'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a project nature...',
						typeOptions: {
							searchListMethod: 'getProjectNatures',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The project nature to work with',
			},

			// Tax Rate ID for tax-rate operations
			{
				displayName: 'Tax Rate',
				name: 'taxRateId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['tax-rate'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a tax rate...',
						typeOptions: {
							searchListMethod: 'getTaxRates',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The tax rate to work with',
			},

			// Accounting Code ID for accounting-code operations
			{
				displayName: 'Accounting Code',
				name: 'accountingCodeId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['accounting-code'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select an accounting code...',
						typeOptions: {
							searchListMethod: 'getAccountingCodes',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The accounting code to work with',
			},

			// Language ID for language operations
			{
				displayName: 'Language',
				name: 'languageId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['language'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a language...',
						typeOptions: {
							searchListMethod: 'getLanguages',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The language to work with',
			},

			// Payslip ID for payslip operations
			{
				displayName: 'Payslip',
				name: 'payslipId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['payslip'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a payslip...',
						typeOptions: {
							searchListMethod: 'getPayslips',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The payslip to work with',
			},

			// Pipe ID for pipe operations
			{
				displayName: 'Pipe',
				name: 'pipeId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['pipe'],
						operation: ['get'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a pipe...',
						typeOptions: {
							searchListMethod: 'getPipes',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The pipe to work with',
			},

			// Required fields for create operations
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company', 'product', 'project', 'supplier'],
						operation: ['create'],
					},
				},
				description: 'Name of the resource',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				description: 'Project number (e.g., PRJ-001)',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['supplier-contract', 'task', 'ticket'],
						operation: ['create'],
					},
				},
				description: 'Title of the resource',
			},

			// UPSERT specific fields
			{
				displayName: 'Unique Field',
				name: 'uniqueField',
				type: 'options',
				options: [
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Third Party Code',
						value: 'thirdparty_code',
					},
				],
				default: 'name',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['upsert'],
					},
				},
				description: 'Field to use for identifying existing records',
			},
			{
				displayName: 'Email',
				name: 'uniqueValue',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['upsert'],
					},
				},
				description: 'Email address to search for (must be unique)',
			},
			{
				displayName: 'Opportunity Name',
				name: 'uniqueValue',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['upsert'],
					},
				},
				description: 'Name of the opportunity to search for',
			},
			{
				displayName: 'Unique Field',
				name: 'uniqueField',
				type: 'options',
				options: [
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Reference',
						value: 'reference',
					},
				],
				default: 'name',
				required: true,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['upsert'],
					},
				},
				description: 'Field to use for identifying existing products',
			},
			{
				displayName: 'Unique Field',
				name: 'uniqueField',
				type: 'options',
				options: [
					{
						name: 'Name',
						value: 'name',
					},
					{
						name: 'Number',
						value: 'number',
					},
				],
				default: 'name',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['upsert'],
					},
				},
				description: 'Field to use for identifying existing projects',
			},
			{
				displayName: 'Unique Value',
				name: 'uniqueValue',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company', 'product', 'project'],
						operation: ['upsert'],
					},
				},
				description: 'Value to search for in the unique field',
			},

			// Dynamic dropdowns for foreign keys using resourceLocator
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['employee', 'opportunity', 'project', 'address', 'contract', 'document', 'task', 'invoice'],
						operation: ['create'],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						placeholder: 'Select a company...',
						typeOptions: {
							searchListMethod: 'getCompanies',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123',
					},
				],
				description: 'The company this entity belongs to',
			},

			// ===========================================
			// COMPANY REQUIRED FIELDS
			// ===========================================
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create'],
					},
				},
				description: 'Company name (required)',
			},

			// ===========================================
			// COMPANY FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'companyFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Company email address',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Company phone number',
					},
					{
						displayName: 'Website',
						name: 'website',
						type: 'string',
						default: '',
						description: 'Company website URL',
					},
					{
						displayName: 'Third Party Code',
						name: 'thirdparty_code',
						type: 'string',
						default: '',
						description: 'External reference code for the company',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Company address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'Company city',
					},
					{
						displayName: 'Postal Code',
						name: 'postal_code',
						type: 'string',
						default: '',
						description: 'Company postal code',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Company country',
					},
				],
			},

			// ===========================================
			// EMPLOYEE FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'employeeFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
						description: 'Employee first name',
					},
					{
						displayName: 'Last Name',
						name: 'lastname',
						type: 'string',
						default: '',
						description: 'Employee last name',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Employee email address',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Employee phone number',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'string',
						default: '',
						description: 'Employee position/job title',
					},
					{
						displayName: 'Department',
						name: 'department',
						type: 'string',
						default: '',
						description: 'Employee department',
					},
				],
			},

			// ===========================================
			// PRODUCT REQUIRED FIELDS
			// ===========================================
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create'],
					},
				},
				description: 'Product name (required)',
			},
			
			// Stock quantity for updateStock operation
			{
				displayName: 'Stock Quantity',
				name: 'stockQuantity',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['updateStock'],
					},
				},
				description: 'New stock quantity',
			},

			// ===========================================
			// PRODUCT FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'productFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'Reference',
						name: 'reference',
						type: 'string',
						default: '',
						description: 'Product reference code',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Product description',
					},
					{
						displayName: 'Price',
						name: 'price',
						type: 'number',
						default: 0,
						description: 'Product price',
					},
					{
						displayName: 'Unit',
						name: 'unit',
						type: 'string',
						default: '',
						description: 'Product unit (e.g., pieces, hours, kg)',
					},
				],
			},

			// ===========================================
			// PROJECT REQUIRED FIELDS
			// ===========================================
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				description: 'Project title (required)',
			},

			// ===========================================
			// PROJECT FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'projectFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Project description',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Project start date',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'Project end date',
					},
					{
						displayName: 'Budget',
						name: 'budget',
						type: 'number',
						default: 0,
						description: 'Project budget',
					},
				],
			},

			// ===========================================
			// OPPORTUNITY FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'opportunityFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Opportunity name',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Opportunity amount',
					},
					{
						displayName: 'Probability',
						name: 'probability',
						type: 'number',
						default: 50,
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						description: 'Opportunity probability (%)',
					},
					{
						displayName: 'Close Date',
						name: 'close_date',
						type: 'dateTime',
						default: '',
						description: 'Expected close date',
					},
					{
						displayName: 'Stage',
						name: 'stage',
						type: 'string',
						default: '',
						description: 'Opportunity stage',
					},
				],
			},

			// ===========================================
			// TASK REQUIRED FIELDS
			// ===========================================
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create'],
					},
				},
				description: 'Task title (required)',
			},

			// ===========================================
			// TASK FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'taskFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Task description',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{ name: 'Low', value: 'low' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'High', value: 'high' },
							{ name: 'Urgent', value: 'urgent' },
						],
						default: 'medium',
						description: 'Task priority level',
					},
					{
						displayName: 'Due Date',
						name: 'due_date',
						type: 'dateTime',
						default: '',
						description: 'Task due date',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Not Started', value: 'not_started' },
							{ name: 'In Progress', value: 'in_progress' },
							{ name: 'Completed', value: 'completed' },
							{ name: 'Cancelled', value: 'cancelled' },
						],
						default: 'not_started',
						description: 'Task status',
					},
				],
			},

			// ===========================================
			// TICKET REQUIRED FIELDS
			// ===========================================
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
					},
				},
				description: 'Ticket title (required)',
			},

			// ===========================================
			// TICKET FIELDS COLLECTION
			// ===========================================
			{
				displayName: 'Add Fields',
				name: 'ticketFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Ticket description',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Bug', value: 'bug' },
							{ name: 'Feature Request', value: 'feature' },
							{ name: 'Support', value: 'support' },
							{ name: 'Question', value: 'question' },
						],
						default: 'support',
						description: 'Ticket type',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{ name: 'Low', value: 'low' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'High', value: 'high' },
							{ name: 'Critical', value: 'critical' },
						],
						default: 'medium',
						description: 'Ticket priority',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Open', value: 'open' },
							{ name: 'In Progress', value: 'in_progress' },
							{ name: 'Resolved', value: 'resolved' },
							{ name: 'Closed', value: 'closed' },
						],
						default: 'open',
						description: 'Ticket status',
					},
				],
			},

			// Additional fields collection for all operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['create', 'update', 'getAll'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of results to return (applied client-side)',
						typeOptions: {
							minValue: 1,
							maxValue: 1000,
						},
						displayOptions: {
							show: {
								'/operation': ['getAll'],
							},
						},
					},
					{
						displayName: 'External ID',
						name: 'external_id',
						type: 'string',
						default: '',
						description: 'External system ID',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Tags (comma-separated)',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Internal notes',
					},
					{
						displayName: 'Custom Field',
						name: 'custom_field',
						type: 'string',
						default: '',
						description: 'Any custom API field not covered in specific collections',
					},
				],
			},
		],
	};

	methods = {
		listSearch: {
			async getCompanies(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/companies', 'id', 'name', 'Company', filter);
			},
			async getEmployees(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/employees', 'id', ['firstname', 'lastname'], 'Employee', filter);
			},
			async getInvoices(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/invoices', 'id', 'number', 'Invoice', filter);
			},
			async getOpportunities(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/opportunities', 'id', 'name', 'Opportunity', filter);
			},
			async getProducts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/products', 'id', 'name', 'Product', filter);
			},
			async getQuotations(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/quotations', 'id', 'title', 'Quotation', filter);
			},
			async getProjects(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/projects', 'id', 'name', 'Project', filter);
			},
			async getEvents(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/events', 'id', 'title', 'Event', filter);
			},
			async getExpenses(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/expenses', 'id', 'title', 'Expense', filter);
			},
			async getAddresss(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// For addresses, we need to get them from all companies since they're company-specific
				try {
					const companies = await axonautApiRequest.call(this, 'GET', '/companies');
					const results: INodeListSearchResult = { results: [] };
					
					for (const company of companies.slice(0, 10)) { // Limit to first 10 companies for performance
						try {
							const addresses = await axonautApiRequest.call(this, 'GET', `/companies/${company.id}/addresses`);
							if (Array.isArray(addresses)) {
								for (const address of addresses) {
									const displayName = address.name || `${address.address_street || ''} ${address.address_city || ''}`.trim() || `Address ${address.id}`;
									if (!filter || displayName.toLowerCase().includes(filter.toLowerCase())) {
										results.results.push({
											name: `${displayName} (${company.name})`,
											value: address.id.toString(),
										});
									}
								}
							}
						} catch (error) {
							// Skip companies that don't have addresses accessible
							continue;
						}
					}
					
					results.results.sort((a, b) => a.name.localeCompare(b.name));
					return results;
				} catch (error) {
					return { results: [] };
				}
			},
			async getContracts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/contracts', 'id', 'number', 'Contract', filter);
			},

			async getDocuments(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// For documents, we need to get them from all companies since they're company-specific
				try {
					const companies = await axonautApiRequest.call(this, 'GET', '/companies');
					const results: INodeListSearchResult = { results: [] };
					
					// Check more companies but limit to 50 for performance
					const companiesToCheck = companies.slice(0, 50);
					
					for (const company of companiesToCheck) {
						try {
							const documents = await axonautApiRequest.call(this, 'GET', `/companies/${company.id}/documents`);
							if (Array.isArray(documents)) {
								for (const document of documents) {
									// Create descriptive name with document info
									const name = document.name || document.filename || `Document ${document.id}`;
									const type = document.type || '';
									const date = document.created_at ? document.created_at.split('T')[0] : '';
									
									let displayName = name;
									if (type) displayName += ` (${type})`;
									if (date) displayName += ` - ${date}`;
									displayName += ` [${company.name}]`;
									
									if (!filter || displayName.toLowerCase().includes(filter.toLowerCase())) {
										results.results.push({
											name: displayName,
											value: document.id.toString(),
										});
									}
								}
							}
						} catch (error) {
							// Skip companies that don't have documents accessible
							continue;
						}
					}
					
					results.results.sort((a, b) => a.name.localeCompare(b.name));
					return results;
				} catch (error) {
					return { results: [] };
				}
			},
			async getSuppliers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/suppliers', 'id', 'name', 'Supplier', filter);
			},
			async getSupplierContracts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/supplier-contracts', 'id', 'title', 'Supplier contract', filter);
			},

			async getTasks(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/tasks', 'id', 'title', 'Task', filter);
			},
			async getTickets(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return await getResourceList.call(this, '/tickets', 'id', 'title', 'Ticket', filter);
			},
			async getTimetrackings(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// Custom implementation for timetrackings since they don't have a simple name field
				const response = await axonautApiRequest.call(this, 'GET', '/timetrackings');
				const timetrackings = Array.isArray(response) ? response : [];
				
				let results = timetrackings.map((timetracking: any) => {
					// Create descriptive name from available fields
					const hours = timetracking.hours ? `${timetracking.hours}h` : '';
					const date = timetracking.startDate ? timetracking.startDate.split(' ')[0] : '';
					const comment = timetracking.comment || '';
					const workforce = timetracking.workforce ? 
						`${timetracking.workforce.first_name} ${timetracking.workforce.last_name}`.trim() : '';
					
					// Build descriptive name
					let name = '';
					if (hours) name += hours;
					if (date) name += (name ? ' - ' : '') + date;
					if (workforce) name += (name ? ' (' : '(') + workforce + ')';
					if (comment) name += (name ? ' - ' : '') + comment;
					if (!name) name = `Timetracking ${timetracking.id}`;
					
					return {
						name,
						value: timetracking.id.toString(),
					};
				});

				// Apply filter if provided
				if (filter) {
					const filterLower = filter.toLowerCase();
					results = results.filter((item: any) => 
						item.name.toLowerCase().includes(filterLower)
					);
				}

				return { results };
			},
			async getInvoicePayments(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// Custom implementation for invoice payments to create descriptive names
				const response = await axonautApiRequest.call(this, 'GET', '/payments');
				const payments = Array.isArray(response) ? response : [];
				
				let results = payments.map((payment: any) => {
					// Create descriptive name: amount - date - reference (nature)
					const amount = payment.amount ? `${payment.amount}€` : '';
					const date = payment.date || '';
					const reference = payment.reference || '';
					const nature = payment.nature || '';
					
					let name = '';
					if (amount) name += amount;
					if (date) name += (name ? ' - ' : '') + date;
					if (reference) name += (name ? ' - ' : '') + reference;
					if (nature) name += (name ? ' (' : '(') + nature + ')';
					if (!name) name = `Payment ${payment.id}`;
					
					return {
						name,
						value: payment.id.toString(),
					};
				});

				// Apply filter if provided
				if (filter) {
					const filterLower = filter.toLowerCase();
					results = results.filter((item: any) => 
						item.name.toLowerCase().includes(filterLower)
					);
				}

				return { results };
			},
			async getExpensePayments(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// Custom implementation for expense payments to create descriptive names
				const response = await axonautApiRequest.call(this, 'GET', '/expense-payments');
				const payments = Array.isArray(response) ? response : [];
				
				let results = payments.map((payment: any) => {
					// Create descriptive name: amount - date - reference (nature)
					const amount = payment.amount ? `${payment.amount}€` : '';
					const date = payment.date || '';
					const reference = payment.reference ? payment.reference.substring(0, 50) : ''; // Limit reference length
					const nature = payment.nature || '';
					
					let name = '';
					if (amount) name += amount;
					if (date) name += (name ? ' - ' : '') + date;
					if (reference) name += (name ? ' - ' : '') + reference + (payment.reference && payment.reference.length > 50 ? '...' : '');
					if (nature) name += (name ? ' (' : '(') + nature + ')';
					if (!name) name = `Expense Payment ${payment.id}`;
					
					return {
						name,
						value: payment.id.toString(),
					};
				});

				// Apply filter if provided
				if (filter) {
					const filterLower = filter.toLowerCase();
					results = results.filter((item: any) => 
						item.name.toLowerCase().includes(filterLower)
					);
				}

				return { results };
			},
			async getBankTransactions(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				// Custom implementation for bank transactions to create descriptive names
				const response = await axonautApiRequest.call(this, 'GET', '/bank-transactions');
				const transactions = Array.isArray(response) ? response : [];
				
				let results = transactions.map((transaction: any) => {
					// Create descriptive name: amount - date - counterparty - description
					const amount = transaction.amount ? `${transaction.amount}€` : '';
					const date = transaction.operation_date || '';
					const counterparty = transaction.counterparty_name || '';
					const description = transaction.description ? transaction.description.substring(0, 40) : '';
					
					let name = '';
					if (amount) name += amount;
					if (date) name += (name ? ' - ' : '') + date;
					if (counterparty) name += (name ? ' - ' : '') + counterparty;
					if (description) name += (name ? ' - ' : '') + description + (transaction.description && transaction.description.length > 40 ? '...' : '');
					if (!name) name = `Transaction ${transaction.id}`;
					
					return {
						name,
						value: transaction.id.toString(),
					};
				});

				// Apply filter if provided
				if (filter) {
					const filterLower = filter.toLowerCase();
					results = results.filter((item: any) => 
						item.name.toLowerCase().includes(filterLower)
					);
				}

				return { results };
			},

			// NEW METHODS FOR THE ADDED GET OPERATIONS
			async getThemes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/themes', 'id', 'name', 'Theme', filter);
			},
			async getBankAccounts(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/bank-accounts', 'id', 'name', 'Bank Account', filter);
			},
			async getCompanyCategories(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/company-categories', 'id', 'name', 'Company Category', filter);
			},
			async getTaskNatures(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/taskNatures', 'id', 'name', 'Task Nature', filter);
			},
			async getProjectNatures(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/projectNatures', 'id', 'name', 'Project Nature', filter);
			},
			async getTaxRates(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/tax-rates', 'id', 'name', 'Tax Rate', filter);
			},
			async getAccountingCodes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/accounting-codes', 'id', 'name', 'Accounting Code', filter);
			},
			async getLanguages(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/languages', 'id', 'name', 'Language', filter);
			},
			async getPayslips(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/payslips', 'id', 'id', 'Payslip', filter);
			},
			async getPipes(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/pipes', 'id', 'name', 'Pipe', filter);
			},
			async getWorkforces(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return getResourceList.call(this, '/workforces', 'id', ['firstname', 'lastname'], 'Workforce', filter);
			},
		},
	};



	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				// Company operations
				if (resource === 'company') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const body: any = { name };
						
						// Add fields from the new collection
						const companyFields = this.getNodeParameter('companyFields', i, {}) as any;
						Object.assign(body, companyFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/companies', body);
					}
					if (operation === 'get') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/companies');
						
						// Apply client-side limit (like Dendreo)
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = {};
						
						// Add fields from the new collection
						const companyFields = this.getNodeParameter('companyFields', i, {}) as any;
						Object.assign(body, companyFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'PATCH', `/companies/${companyId}`, body);
					}
					if (operation === 'delete') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/companies/${companyId}`);
					}
					if (operation === 'upsert') {
						const uniqueField = this.getNodeParameter('uniqueField', i) as string;
						const uniqueValue = this.getNodeParameter('uniqueValue', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						
						// Search for existing company
						const companies = await axonautApiRequest.call(this, 'GET', '/companies');
						const existingCompany = companies.find((company: any) => company[uniqueField] === uniqueValue);
						
						if (existingCompany) {
							// Update existing company
							const body: any = {};
							const companyFields = this.getNodeParameter('companyFields', i, {}) as any;
							Object.assign(body, companyFields);
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/companies/${existingCompany.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new company
							const body: any = { [uniqueField]: uniqueValue };
							const companyFields = this.getNodeParameter('companyFields', i, {}) as any;
							Object.assign(body, companyFields);
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'POST', '/companies', body);
							responseData._operation = 'created';
						}
					}
				}

				// Employee operations
				if (resource === 'employee') {
					if (operation === 'create') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { company_id: companyId };
						
						// Add fields from the new collection
						const employeeFields = this.getNodeParameter('employeeFields', i, {}) as any;
						Object.assign(body, employeeFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/employees', body);
					}
					if (operation === 'get') {
						const employeeLocator = this.getNodeParameter('employeeId', i) as any;
						const employeeId = employeeLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/employees/${employeeId}`);
					}
					if (operation === 'getCompanyEmployees') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/employees`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/employees');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const employeeLocator = this.getNodeParameter('employeeId', i) as any;
						const employeeId = employeeLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/employees/${employeeId}`, body);
					}
					if (operation === 'delete') {
						const employeeLocator = this.getNodeParameter('employeeId', i) as any;
						const employeeId = employeeLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/employees/${employeeId}`);
					}
					if (operation === 'upsert') {
						const email = this.getNodeParameter('uniqueValue', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						
						// Search for existing employee by email (API supports direct filtering)
						const existingEmployees = await axonautApiRequest.call(this, 'GET', `/employees?email=${encodeURIComponent(email)}`);
						
						if (existingEmployees && existingEmployees.length > 0) {
							// Update existing employee
							const existingEmployee = existingEmployees[0];
							const body: any = {};
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/employees/${existingEmployee.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new employee
							const companyLocator = this.getNodeParameter('companyId', i) as any;
							const companyId = companyLocator.value;
							const body: any = { email, company_id: companyId };
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'POST', '/employees', body);
							responseData._operation = 'created';
						}
					}
				}

				// Invoice operations
				if (resource === 'invoice') {
					if (operation === 'get') {
						const invoiceLocator = this.getNodeParameter('invoiceId', i) as any;
						const invoiceId = invoiceLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/invoices/${invoiceId}`);
					}
					if (operation === 'getCompanyInvoices') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/invoices`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/invoices');
						
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Opportunity operations
				if (resource === 'opportunity') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/opportunities', body);
					}
					if (operation === 'get') {
						const opportunityLocator = this.getNodeParameter('opportunityId', i) as any;
						const opportunityId = opportunityLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/opportunities/${opportunityId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/opportunities');
						
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const opportunityLocator = this.getNodeParameter('opportunityId', i) as any;
						const opportunityId = opportunityLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/opportunities/${opportunityId}`, body);
					}
					if (operation === 'delete') {
						const opportunityLocator = this.getNodeParameter('opportunityId', i) as any;
						const opportunityId = opportunityLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/opportunities/${opportunityId}`);
					}
					if (operation === 'upsert') {
						const opportunityName = this.getNodeParameter('uniqueValue', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						
						// Search for existing opportunity by name (client-side filtering)
						const opportunities = await axonautApiRequest.call(this, 'GET', '/opportunities');
						const existingOpportunity = opportunities.find((opportunity: any) => opportunity.name === opportunityName);
						
						if (existingOpportunity) {
							// Update existing opportunity
							const body: any = {};
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/opportunities/${existingOpportunity.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new opportunity
							const body: any = { name: opportunityName, company_id: companyId };
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'POST', '/opportunities', body);
							responseData._operation = 'created';
						}
					}
					if (operation === 'markWon') {
						const opportunityLocator = this.getNodeParameter('opportunityId', i) as any;
						const opportunityId = opportunityLocator.value;
						responseData = await axonautApiRequest.call(this, 'PATCH', `/opportunities/${opportunityId}/won`, {});
					}
					if (operation === 'markLost') {
						const opportunityLocator = this.getNodeParameter('opportunityId', i) as any;
						const opportunityId = opportunityLocator.value;
						responseData = await axonautApiRequest.call(this, 'PATCH', `/opportunities/${opportunityId}/lost`, {});
					}
				}

				// Product operations
				if (resource === 'product') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const body: any = { name };
						
						// Add fields from the new collection
						const productFields = this.getNodeParameter('productFields', i, {}) as any;
						Object.assign(body, productFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/products', body);
					}
					if (operation === 'get') {
						const productLocator = this.getNodeParameter('productId', i) as any;
						const productId = productLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/products/${productId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/products');
						
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const productLocator = this.getNodeParameter('productId', i) as any;
						const productId = productLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/products/${productId}`, body);
					}
					if (operation === 'delete') {
						const productLocator = this.getNodeParameter('productId', i) as any;
						const productId = productLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/products/${productId}`);
					}
					if (operation === 'upsert') {
						const uniqueField = this.getNodeParameter('uniqueField', i) as string;
						const uniqueValue = this.getNodeParameter('uniqueValue', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						
						// Search for existing product (client-side filtering)
						const products = await axonautApiRequest.call(this, 'GET', '/products');
						const existingProduct = products.find((product: any) => product[uniqueField] === uniqueValue);
						
						if (existingProduct) {
							// Update existing product
							const body: any = {};
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/products/${existingProduct.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new product
							const body: any = { [uniqueField]: uniqueValue };
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'POST', '/products', body);
							responseData._operation = 'created';
						}
					}
					if (operation === 'getStock') {
						const productLocator = this.getNodeParameter('productId', i) as any;
						const productId = productLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/products/${productId}/stock`);
					}
					if (operation === 'updateStock') {
						const productLocator = this.getNodeParameter('productId', i) as any;
						const productId = productLocator.value;
						const stockQuantity = this.getNodeParameter('stockQuantity', i) as number;
						const body = { quantity: stockQuantity };
						responseData = await axonautApiRequest.call(this, 'PATCH', `/products/${productId}/stock`, body);
					}
				}

				// Quotation operations
				if (resource === 'quotation') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/quotations', body);
					}
					if (operation === 'get') {
						const quotationLocator = this.getNodeParameter('quotationId', i) as any;
						const quotationId = quotationLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/quotations/${quotationId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/quotations');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getCompanyQuotations') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/quotations`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Project operations
				if (resource === 'project') {
					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { title, company_id: companyId };
						
						// Add fields from the new collection
						const projectFields = this.getNodeParameter('projectFields', i, {}) as any;
						Object.assign(body, projectFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/projects', body);
					}
					if (operation === 'get') {
						const projectLocator = this.getNodeParameter('projectId', i) as any;
						const projectId = projectLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/projects/${projectId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/projects');
						
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const projectLocator = this.getNodeParameter('projectId', i) as any;
						const projectId = projectLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/projects/${projectId}`, body);
					}
					if (operation === 'delete') {
						const projectLocator = this.getNodeParameter('projectId', i) as any;
						const projectId = projectLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
					}
					if (operation === 'upsert') {
						const uniqueField = this.getNodeParameter('uniqueField', i) as string;
						const uniqueValue = this.getNodeParameter('uniqueValue', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						
						// Search for existing project (client-side filtering)
						const projects = await axonautApiRequest.call(this, 'GET', '/projects');
						const existingProject = projects.find((project: any) => project[uniqueField] === uniqueValue);
						
						if (existingProject) {
							// Update existing project
							const body: any = {};
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/projects/${existingProject.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new project - need name and number for creation
							const name = uniqueField === 'name' ? uniqueValue : (additionalFields.name || `Project ${uniqueValue}`);
							const number = uniqueField === 'number' ? uniqueValue : (additionalFields.number || `PRJ-${Date.now()}`);
							const body: any = { name, number, company_id: companyId };
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'POST', '/projects', body);
							responseData._operation = 'created';
						}
					}
				}

				// Expense operations
				if (resource === 'expense') {
					if (operation === 'get') {
						const expenseLocator = this.getNodeParameter('expenseId', i) as any;
						const expenseId = expenseLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/expenses/${expenseId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/expenses');
					}
					if (operation === 'createPayment') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/expenses/payments', body);
					}
				}

				// Event operations
				if (resource === 'event') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/events', body);
					}
					if (operation === 'get') {
						const eventLocator = this.getNodeParameter('eventId', i) as any;
						const eventId = eventLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/events/${eventId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/events');
						
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const eventLocator = this.getNodeParameter('eventId', i) as any;
						const eventId = eventLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/events/${eventId}`, body);
					}
					if (operation === 'getCompanyEvents') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/events`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'send') {
						const eventLocator = this.getNodeParameter('eventId', i) as any;
						const eventId = eventLocator.value;
						responseData = await axonautApiRequest.call(this, 'POST', `/events/${eventId}/send`);
					}
					if (operation === 'delete') {
						const eventLocator = this.getNodeParameter('eventId', i) as any;
						const eventId = eventLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/events/${eventId}`);
					}
				}

				// Address operations
				if (resource === 'address') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/addresses', body);
					}
					if (operation === 'get') {
						const addressLocator = this.getNodeParameter('addressId', i) as any;
						const addressId = addressLocator.value;
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						
						// Get all addresses for the company, then filter by address ID
						const addresses = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/addresses`);
						responseData = addresses.find((address: any) => address.id.toString() === addressId.toString());
						
						if (!responseData) {
							throw new NodeOperationError(this.getNode(), `Address with ID ${addressId} not found in company ${companyId}`);
						}
					}
					if (operation === 'getAll') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/addresses`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const addressLocator = this.getNodeParameter('addressId', i) as any;
						const addressId = addressLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/addresses/${addressId}`, body);
					}
					if (operation === 'delete') {
						const addressLocator = this.getNodeParameter('addressId', i) as any;
						const addressId = addressLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/addresses/${addressId}`);
					}
				}

				// Bank transaction operations
				if (resource === 'bank-transaction') {
					if (operation === 'get') {
						const bankTransactionLocator = this.getNodeParameter('bankTransactionId', i) as any;
						const bankTransactionId = bankTransactionLocator.value;
						
						// Get all bank transactions and filter client-side (API doesn't support GET by ID)
						const allBankTransactions = await axonautApiRequest.call(this, 'GET', '/bank-transactions');
						
						if (Array.isArray(allBankTransactions)) {
							responseData = allBankTransactions.find((transaction: any) => 
								transaction.id.toString() === bankTransactionId.toString()
							);
							
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Bank transaction with ID ${bankTransactionId} not found`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve bank transactions list');
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/bank-transactions');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Contract operations
				if (resource === 'contract') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/contracts', body);
					}
					if (operation === 'get') {
						const contractLocator = this.getNodeParameter('contractId', i) as any;
						const contractId = contractLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/contracts/${contractId}`);
					}
					if (operation === 'getCompanyContracts') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/contracts`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/contracts');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const contractLocator = this.getNodeParameter('contractId', i) as any;
						const contractId = contractLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/contracts/${contractId}`, body);
					}
				}



				// Document operations (company-specific)
				if (resource === 'document') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', `/companies/${companyId}/documents`, body);
					}
					if (operation === 'get') {
						const documentLocator = this.getNodeParameter('documentId', i) as any;
						const documentId = documentLocator.value;
						
						// Use direct API route for documents
						responseData = await axonautApiRequest.call(this, 'GET', `/documents/${documentId}`);
					}
					if (operation === 'getCompanyDocuments') {
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}/documents`);
					}
					if (operation === 'update') {
						const documentLocator = this.getNodeParameter('documentId', i) as any;
						const documentId = documentLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						
						// Find the company first, then update
						const companies = await axonautApiRequest.call(this, 'GET', '/companies');
						let companyId = null;
						
						for (const company of companies) {
							try {
								const documents = await axonautApiRequest.call(this, 'GET', `/companies/${company.id}/documents`);
								if (Array.isArray(documents) && documents.find(doc => doc.id.toString() === documentId)) {
									companyId = company.id;
									break;
								}
							} catch (error) {
								continue;
							}
						}
						
						if (companyId) {
							const body: any = {};
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/companies/${companyId}/documents/${documentId}`, body);
						} else {
							throw new Error(`Document with ID ${documentId} not found`);
						}
					}
					if (operation === 'download') {
						const documentLocator = this.getNodeParameter('documentId', i) as any;
						const documentId = documentLocator.value;
						
						// Use the download endpoint
						responseData = await axonautApiRequest.call(this, 'GET', `/documents/${documentId}/download`);
					}
				}

				// Expense payment operations
				if (resource === 'expense-payment') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/expense-payments', body);
					}
					if (operation === 'get') {
						const expensePaymentLocator = this.getNodeParameter('expensePaymentId', i) as any;
						const expensePaymentId = expensePaymentLocator.value;
						
						// Get all expense payments and filter client-side (API doesn't support GET by ID)
						const allExpensePayments = await axonautApiRequest.call(this, 'GET', '/expense-payments');
						
						if (Array.isArray(allExpensePayments)) {
							responseData = allExpensePayments.find((payment: any) => 
								payment.id.toString() === expensePaymentId.toString()
							);
							
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Expense payment with ID ${expensePaymentId} not found`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve expense payments list');
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/expense-payments');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Invoice payment operations
				if (resource === 'invoice-payment') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/payments', body);
					}
					if (operation === 'get') {
						const invoicePaymentLocator = this.getNodeParameter('invoicePaymentId', i) as any;
						const invoicePaymentId = invoicePaymentLocator.value;
						
						// Get all invoice payments and filter client-side (API doesn't support GET by ID)
						const allInvoicePayments = await axonautApiRequest.call(this, 'GET', '/payments');
						
						if (Array.isArray(allInvoicePayments)) {
							responseData = allInvoicePayments.find((payment: any) => 
								payment.id.toString() === invoicePaymentId.toString()
							);
							
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Invoice payment with ID ${invoicePaymentId} not found`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve invoice payments list');
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/payments');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Supplier operations
				if (resource === 'supplier') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = { name };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/suppliers', body);
					}
					if (operation === 'get') {
						const supplierLocator = this.getNodeParameter('supplierId', i) as any;
						const supplierId = supplierLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/suppliers/${supplierId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/suppliers');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Supplier contract operations
				if (resource === 'supplier-contract') {
					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = { title };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/supplier-contracts', body);
					}
					if (operation === 'get') {
						const suppliercontractLocator = this.getNodeParameter('suppliercontractId', i) as any;
						const suppliercontractId = suppliercontractLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/supplier-contracts/${suppliercontractId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/supplier-contracts');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}



				// Task operations
				if (resource === 'task') {
					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { title, company_id: companyId };
						
						// Add fields from the new collection
						const taskFields = this.getNodeParameter('taskFields', i, {}) as any;
						Object.assign(body, taskFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/tasks', body);
					}
					if (operation === 'get') {
						const taskLocator = this.getNodeParameter('taskId', i) as any;
						const taskId = taskLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/tasks/${taskId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/tasks');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'delete') {
						const taskLocator = this.getNodeParameter('taskId', i) as any;
						const taskId = taskLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
					}
				}

				// Ticket operations
				if (resource === 'ticket') {
					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const body: any = { title };
						
						// Add fields from the new collection
						const ticketFields = this.getNodeParameter('ticketFields', i, {}) as any;
						Object.assign(body, ticketFields);
						
						// Add any additional fields from the fallback collection
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/tickets', body);
					}
					if (operation === 'get') {
						const ticketLocator = this.getNodeParameter('ticketId', i) as any;
						const ticketId = ticketLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/tickets/${ticketId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/tickets');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'update') {
						const ticketLocator = this.getNodeParameter('ticketId', i) as any;
						const ticketId = ticketLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PATCH', `/tickets/${ticketId}`, body);
					}
				}

				// Timetracking operations
				if (resource === 'timetracking') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/timetrackings', body);
					}
					if (operation === 'get') {
						const timetrackingLocator = this.getNodeParameter('timetrackingId', i) as any;
						const timetrackingId = timetrackingLocator.value;
						
						// Get all timetrackings and filter client-side (API doesn't support GET by ID)
						const allTimetrackings = await axonautApiRequest.call(this, 'GET', '/timetrackings');
						
						if (Array.isArray(allTimetrackings)) {
							responseData = allTimetrackings.find((timetracking: any) => 
								timetracking.id.toString() === timetrackingId.toString()
							);
							
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Timetracking with ID ${timetrackingId} not found`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), 'Failed to retrieve timetrackings list');
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/timetrackings');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getTaskTimetrackings') {
						const taskLocator = this.getNodeParameter('taskId', i) as any;
						const taskId = taskLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/tasks/${taskId}/timetrackings`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getTicketTimetrackings') {
						const ticketLocator = this.getNodeParameter('ticketId', i) as any;
						const ticketId = ticketLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/tickets/${ticketId}/timetrackings`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getTaskTimetrackings') {
						const taskLocator = this.getNodeParameter('taskId', i) as any;
						const taskId = taskLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/tasks/${taskId}/timetrackings`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getTicketTimetrackings') {
						const ticketLocator = this.getNodeParameter('ticketId', i) as any;
						const ticketId = ticketLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', `/tickets/${ticketId}/timetrackings`);
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'delete') {
						const timetrackingLocator = this.getNodeParameter('timetrackingId', i) as any;
						const timetrackingId = timetrackingLocator.value;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/timetrackings/${timetrackingId}`);
					}
				}

				// Supplier Delivery operations
				if (resource === 'supplier-delivery') {
					if (operation === 'get') {
						const supplierDeliveryLocator = this.getNodeParameter('supplierDeliveryId', i) as any;
						const supplierDeliveryId = supplierDeliveryLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/supplier-deliveries/${supplierDeliveryId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/supplier-deliveries');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'createReceipt') {
						const supplierDeliveryLocator = this.getNodeParameter('supplierDeliveryId', i) as any;
						const supplierDeliveryId = supplierDeliveryLocator.value;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', `/supplier-deliveries/${supplierDeliveryId}/receipt`, body);
					}
					if (operation === 'deleteReceipt') {
						const supplierDeliveryLocator = this.getNodeParameter('supplierDeliveryId', i) as any;
						const supplierDeliveryId = supplierDeliveryLocator.value;
						const receiptId = this.getNodeParameter('receiptId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/supplier-deliveries/${supplierDeliveryId}/receipt/${receiptId}`);
					}
				}

				// Diverse Operations operations
				if (resource === 'diverse-operations') {
					if (operation === 'get') {
						const diverseOperationLocator = this.getNodeParameter('diverseOperationId', i) as any;
						const diverseOperationId = diverseOperationLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/diverse-operations/${diverseOperationId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/diverse-operations');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Delivery Forms operations
				if (resource === 'delivery-forms') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/delivery-forms', body);
					}
					if (operation === 'get') {
						const deliveryFormLocator = this.getNodeParameter('deliveryFormId', i) as any;
						const deliveryFormId = deliveryFormLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/delivery-forms/${deliveryFormId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/delivery-forms');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'download') {
						const deliveryFormLocator = this.getNodeParameter('deliveryFormId', i) as any;
						const deliveryFormId = deliveryFormLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/delivery-forms/${deliveryFormId}/download`);
					}
				}

				// Themes operations
				if (resource === 'theme') {
					if (operation === 'get') {
						const themeId = this.getNodeParameter('themeId', i) as IDataObject;
						const id = themeId.mode === 'id' ? themeId.value : themeId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Theme ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allThemes = await axonautApiRequest.call(this, 'GET', '/themes');
						if (Array.isArray(allThemes)) {
							responseData = allThemes.find((theme: any) => theme.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Theme with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/themes');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Bank Accounts operations
				if (resource === 'bank-account') {
					if (operation === 'get') {
						const bankAccountId = this.getNodeParameter('bankAccountId', i) as IDataObject;
						const id = bankAccountId.mode === 'id' ? bankAccountId.value : bankAccountId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Bank Account ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allBankAccounts = await axonautApiRequest.call(this, 'GET', '/bank-accounts');
						if (Array.isArray(allBankAccounts)) {
							responseData = allBankAccounts.find((account: any) => account.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Bank account with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/bank-accounts');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Company Categories operations
				if (resource === 'company-category') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/company-categories', body);
					}
					if (operation === 'get') {
						const companyCategoryId = this.getNodeParameter('companyCategoryId', i) as IDataObject;
						const id = companyCategoryId.mode === 'id' ? companyCategoryId.value : companyCategoryId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Company Category ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allCategories = await axonautApiRequest.call(this, 'GET', '/company-categories');
						if (Array.isArray(allCategories)) {
							responseData = allCategories.find((category: any) => category.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Company category with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/company-categories');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Task Natures operations
				if (resource === 'task-nature') {
					if (operation === 'get') {
						const taskNatureId = this.getNodeParameter('taskNatureId', i) as IDataObject;
						const id = taskNatureId.mode === 'id' ? taskNatureId.value : taskNatureId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Task Nature ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allTaskNatures = await axonautApiRequest.call(this, 'GET', '/taskNatures');
						if (Array.isArray(allTaskNatures)) {
							responseData = allTaskNatures.find((nature: any) => nature.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Task nature with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/taskNatures');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Project Natures operations
				if (resource === 'project-nature') {
					if (operation === 'get') {
						const projectNatureId = this.getNodeParameter('projectNatureId', i) as IDataObject;
						const id = projectNatureId.mode === 'id' ? projectNatureId.value : projectNatureId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Project Nature ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allProjectNatures = await axonautApiRequest.call(this, 'GET', '/projectNatures');
						if (Array.isArray(allProjectNatures)) {
							responseData = allProjectNatures.find((nature: any) => nature.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Project nature with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/projectNatures');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Tax Rates operations
				if (resource === 'tax-rate') {
					if (operation === 'get') {
						const taxRateId = this.getNodeParameter('taxRateId', i) as IDataObject;
						const id = taxRateId.mode === 'id' ? taxRateId.value : taxRateId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Tax Rate ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allTaxRates = await axonautApiRequest.call(this, 'GET', '/tax-rates');
						if (Array.isArray(allTaxRates)) {
							responseData = allTaxRates.find((rate: any) => rate.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Tax rate with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/tax-rates');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Accounting Codes operations
				if (resource === 'accounting-code') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/accounting-codes', body);
					}
					if (operation === 'get') {
						const accountingCodeId = this.getNodeParameter('accountingCodeId', i) as IDataObject;
						const id = accountingCodeId.mode === 'id' ? accountingCodeId.value : accountingCodeId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Accounting Code ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allAccountingCodes = await axonautApiRequest.call(this, 'GET', '/accounting-codes');
						if (Array.isArray(allAccountingCodes)) {
							responseData = allAccountingCodes.find((code: any) => code.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Accounting code with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/accounting-codes');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Languages operations
				if (resource === 'language') {
					if (operation === 'get') {
						const languageId = this.getNodeParameter('languageId', i) as IDataObject;
						const id = languageId.mode === 'id' ? languageId.value : languageId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Language ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allLanguages = await axonautApiRequest.call(this, 'GET', '/languages');
						if (Array.isArray(allLanguages)) {
							responseData = allLanguages.find((language: any) => language.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Language with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/languages');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Workforces operations
				if (resource === 'workforce') {
					if (operation === 'get') {
						const workforceLocator = this.getNodeParameter('workforceId', i) as any;
						const workforceId = workforceLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/workforces/${workforceId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/workforces');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Payslips operations
				if (resource === 'payslip') {
					if (operation === 'get') {
						const payslipId = this.getNodeParameter('payslipId', i) as IDataObject;
						const id = payslipId.mode === 'id' ? payslipId.value : payslipId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Payslip ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allPayslips = await axonautApiRequest.call(this, 'GET', '/payslips');
						if (Array.isArray(allPayslips)) {
							responseData = allPayslips.find((payslip: any) => payslip.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Payslip with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/payslips');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Pipes operations
				if (resource === 'pipe') {
					if (operation === 'get') {
						const pipeId = this.getNodeParameter('pipeId', i) as IDataObject;
						const id = pipeId.mode === 'id' ? pipeId.value : pipeId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Pipe ID is required');
						}
						
						// Client-side filtering since direct GET not supported
						const allPipes = await axonautApiRequest.call(this, 'GET', '/pipes');
						if (Array.isArray(allPipes)) {
							responseData = allPipes.find((pipe: any) => pipe.id.toString() === id.toString());
							if (!responseData) {
								throw new NodeOperationError(this.getNode(), `Pipe with ID ${id} not found`);
							}
						}
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/pipes');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Workforces operations
				if (resource === 'workforce') {
					if (operation === 'get') {
						const workforceId = this.getNodeParameter('workforceId', i) as IDataObject;
						const id = workforceId.mode === 'id' ? workforceId.value : workforceId.value;
						
						if (!id) {
							throw new NodeOperationError(this.getNode(), 'Workforce ID is required');
						}
						
						// Direct API call since this endpoint supports single GET
						responseData = await axonautApiRequest.call(this, 'GET', `/workforces/${id}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/workforces');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				// Account operations
				if (resource === 'account') {
					if (operation === 'getCurrentUser') {
						responseData = await axonautApiRequest.call(this, 'GET', '/me');
					}
					if (operation === 'getUsers') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/users');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getCustomFields') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/customfields');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
					if (operation === 'getCreditsHistory') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/credits-history');
						
						// Apply client-side limit
						const limit = additionalFields.limit as number;
						if (limit && Array.isArray(responseData) && responseData.length > limit) {
							responseData = responseData.slice(0, limit);
						}
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as INodeExecutionData[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}