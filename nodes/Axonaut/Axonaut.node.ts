import {
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
				default: 'get',
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
						name: 'Update',
						value: 'update',
						description: 'Update a document',
						action: 'Update a document',
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
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all timetrackings',
						action: 'Get many timetrackings',
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
			{
				displayName: 'Opportunity',
				name: 'opportunityId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['get', 'update', 'delete'],
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
						operation: ['get', 'update', 'delete'],
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



			{
				displayName: 'Document',
				name: 'documentId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'update'],
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
						operation: ['delete'],
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
			// COMPANY SPECIFIC FIELDS
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
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company phone number',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company website URL',
			},
			{
				displayName: 'Third Party Code',
				name: 'thirdparty_code',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'External reference code for the company',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company address',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company city',
			},
			{
				displayName: 'Postal Code',
				name: 'postal_code',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company postal code',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Company country',
			},

			// ===========================================
			// EMPLOYEE SPECIFIC FIELDS
			// ===========================================
			{
				displayName: 'First Name',
				name: 'firstname',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastname',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee email address',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee phone number',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee position/job title',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Employee department',
			},

			// ===========================================
			// PRODUCT SPECIFIC FIELDS
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
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Product reference code',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Product description',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Product price',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Product unit (e.g., pieces, hours, kg)',
			},

			// ===========================================
			// PROJECT SPECIFIC FIELDS
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
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Project description',
			},
			{
				displayName: 'Start Date',
				name: 'start_date',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Project start date',
			},
			{
				displayName: 'End Date',
				name: 'end_date',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Project end date',
			},
			{
				displayName: 'Budget',
				name: 'budget',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Project budget',
			},

			// ===========================================
			// OPPORTUNITY SPECIFIC FIELDS
			// ===========================================
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Opportunity name',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Opportunity probability (%)',
			},
			{
				displayName: 'Close Date',
				name: 'close_date',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Expected close date',
			},
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Opportunity stage',
			},

			// ===========================================
			// TASK SPECIFIC FIELDS
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
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update', 'upsert'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Task priority level',
			},
			{
				displayName: 'Due Date',
				name: 'due_date',
				type: 'dateTime',
				default: '',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update', 'upsert'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['create', 'update', 'upsert'],
					},
				},
				description: 'Task status',
			},

			// ===========================================
			// TICKET SPECIFIC FIELDS
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
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
				description: 'Ticket status',
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
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the entity',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title of the entity',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description of the entity',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Email address',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Phone number',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Address',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City',
					},
					{
						displayName: 'Postal Code',
						name: 'postal_code',
						type: 'string',
						default: '',
						description: 'Postal code',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country',
					},
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'Amount for opportunities/projects',
					},
					{
						displayName: 'Price',
						name: 'price',
						type: 'number',
						default: 0,
						description: 'Price for products',
					},
					{
						displayName: 'Comments',
						name: 'comments',
						type: 'string',
						default: '',
						description: 'Comments or notes',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'dateTime',
						default: '',
						description: 'Date for events/expenses',
					},
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'number',
						default: 0,
						description: 'Duration in minutes for events',
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
					
					for (const company of companies.slice(0, 10)) { // Limit to first 10 companies for performance
						try {
							const documents = await axonautApiRequest.call(this, 'GET', `/companies/${company.id}/documents`);
							if (Array.isArray(documents)) {
								for (const document of documents) {
									const displayName = document.name || `Document ${document.id}`;
									if (!filter || displayName.toLowerCase().includes(filter.toLowerCase())) {
										results.results.push({
											name: `${displayName} (${company.name})`,
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
				return await getResourceList.call(this, '/timetrackings', 'id', 'id', 'Timetracking', filter);
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
						
						// Add all specific fields
						const optionalFields = ['email', 'phone', 'website', 'thirdparty_code', 'address', 'city', 'postal_code', 'country'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, '') as string;
							if (value) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
						
						// Add all specific fields
						const optionalFields = ['email', 'phone', 'website', 'thirdparty_code', 'address', 'city', 'postal_code', 'country'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, '') as string;
							if (value) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
							Object.assign(body, additionalFields);
							responseData = await axonautApiRequest.call(this, 'PATCH', `/companies/${existingCompany.id}`, body);
							responseData._operation = 'updated';
						} else {
							// Create new company
							const body: any = { [uniqueField]: uniqueValue };
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
						
						// Add all specific fields
						const optionalFields = ['firstname', 'lastname', 'email', 'phone', 'position', 'department'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, '') as string;
							if (value) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
						Object.assign(body, additionalFields);
						
						responseData = await axonautApiRequest.call(this, 'POST', '/employees', body);
					}
					if (operation === 'get') {
						const employeeLocator = this.getNodeParameter('employeeId', i) as any;
						const employeeId = employeeLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/employees/${employeeId}`);
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
				}

				// Product operations
				if (resource === 'product') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const body: any = { name };
						
						// Add all specific fields
						const optionalFields = ['reference', 'description', 'price', 'unit'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, field === 'price' ? 0 : '') as string | number;
							if (value !== '' && value !== 0) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
				}

				// Quotation operations
				if (resource === 'quotation') {
					if (operation === 'get') {
						const quotationLocator = this.getNodeParameter('quotationId', i) as any;
						const quotationId = quotationLocator.value;
						responseData = await axonautApiRequest.call(this, 'GET', `/quotations/${quotationId}`);
					}
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/quotations');
					}
				}

				// Project operations
				if (resource === 'project') {
					if (operation === 'create') {
						const title = this.getNodeParameter('title', i) as string;
						const companyLocator = this.getNodeParameter('companyId', i) as any;
						const companyId = companyLocator.value;
						const body: any = { title, company_id: companyId };
						
						// Add all specific fields
						const optionalFields = ['description', 'start_date', 'end_date', 'budget'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, field === 'budget' ? 0 : '') as string | number;
							if (value !== '' && value !== 0) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
						responseData = await axonautApiRequest.call(this, 'GET', `/addresses/${addressId}`);
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
						
						// We need to find the company that has this document
						const companies = await axonautApiRequest.call(this, 'GET', '/companies');
						let documentFound = null;
						
						for (const company of companies) {
							try {
								const documents = await axonautApiRequest.call(this, 'GET', `/companies/${company.id}/documents`);
								if (Array.isArray(documents)) {
									documentFound = documents.find(doc => doc.id.toString() === documentId);
									if (documentFound) break;
								}
							} catch (error) {
								continue;
							}
						}
						
						if (documentFound) {
							responseData = documentFound;
						} else {
							throw new Error(`Document with ID ${documentId} not found`);
						}
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
				}

				// Expense payment operations
				if (resource === 'expense-payment') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/expense-payments', body);
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
						
						// Add all specific fields
						const optionalFields = ['description', 'priority', 'due_date', 'status'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, '') as string;
							if (value) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
						
						// Add all specific fields
						const optionalFields = ['description', 'type', 'priority', 'status'];
						for (const field of optionalFields) {
							const value = this.getNodeParameter(field, i, '') as string;
							if (value) {
								body[field] = value;
							}
						}
						
						// Add any additional fields from the collection
						const additionalFields = this.getNodeParameter('additionalFields', i);
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
					if (operation === 'getAll') {
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						responseData = await axonautApiRequest.call(this, 'GET', '/timetrackings');
						
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