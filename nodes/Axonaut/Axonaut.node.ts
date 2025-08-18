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

export class Axonaut implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Axonaut',
		name: 'axonaut',
		icon: 'file:axonaut.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Axonaut API',
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
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Employee (Contact)',
						value: 'employee',
					},
					{
						name: 'Invoice',
						value: 'invoice',
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
						name: 'Quotation',
						value: 'quotation',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Event',
						value: 'event',
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

			// ID Fields for each resource
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the company',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the employee',
			},
			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the invoice',
			},
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the opportunity',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['product'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the product',
			},
			{
				displayName: 'Quotation ID',
				name: 'quotationId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['quotation'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the quotation',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the project',
			},
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['get'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the expense',
			},
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['event'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the event',
			},

			// Dynamic dropdowns for foreign keys
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				displayOptions: {
					show: {
						resource: ['employee', 'opportunity', 'project'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The company this entity belongs to',
			},

			// Limit field for getAll operations
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			},

			// Additional fields collection for create/update operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				options: [
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
		loadOptions: {
			async getCompanies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const companies = await axonautApiRequest.call(this, 'GET', '/companies');
				
				const returnData: INodePropertyOptions[] = [];
				for (const company of companies) {
					returnData.push({
						name: company.name,
						value: company.id,
					});
				}
				
				return returnData.sort((a, b) => a.name.localeCompare(b.name));
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
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/companies', body);
					}
					if (operation === 'get') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/companies/${companyId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/companies', {}, { limit });
					}
					if (operation === 'update') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/companies/${companyId}`, body);
					}
					if (operation === 'delete') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/companies/${companyId}`);
					}
				}

				// Employee operations
				if (resource === 'employee') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyId = this.getNodeParameter('companyId', i);
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/employees', body);
					}
					if (operation === 'get') {
						const employeeId = this.getNodeParameter('employeeId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/employees/${employeeId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/employees', {}, { limit });
					}
					if (operation === 'update') {
						const employeeId = this.getNodeParameter('employeeId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/employees/${employeeId}`, body);
					}
					if (operation === 'delete') {
						const employeeId = this.getNodeParameter('employeeId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/employees/${employeeId}`);
					}
				}

				// Invoice operations
				if (resource === 'invoice') {
					if (operation === 'get') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/invoices/${invoiceId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/invoices', {}, { limit });
					}
				}

				// Opportunity operations
				if (resource === 'opportunity') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyId = this.getNodeParameter('companyId', i);
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/opportunities', body);
					}
					if (operation === 'get') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/opportunities/${opportunityId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/opportunities', {}, { limit });
					}
					if (operation === 'update') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/opportunities/${opportunityId}`, body);
					}
					if (operation === 'delete') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/opportunities/${opportunityId}`);
					}
				}

				// Product operations
				if (resource === 'product') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/products', body);
					}
					if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/products/${productId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/products', {}, { limit });
					}
					if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/products/${productId}`, body);
					}
					if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/products/${productId}`);
					}
				}

				// Quotation operations
				if (resource === 'quotation') {
					if (operation === 'get') {
						const quotationId = this.getNodeParameter('quotationId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/quotations/${quotationId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/quotations', {}, { limit });
					}
				}

				// Project operations
				if (resource === 'project') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyId = this.getNodeParameter('companyId', i);
						const body: any = { company_id: companyId };
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'POST', '/projects', body);
					}
					if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/projects/${projectId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/projects', {}, { limit });
					}
					if (operation === 'update') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/projects/${projectId}`, body);
					}
					if (operation === 'delete') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
					}
				}

				// Expense operations
				if (resource === 'expense') {
					if (operation === 'get') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/expenses/${expenseId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/expenses', {}, { limit });
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
						const eventId = this.getNodeParameter('eventId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/events/${eventId}`);
					}
					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/events', {}, { limit });
					}
					if (operation === 'update') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};
						Object.assign(body, additionalFields);
						responseData = await axonautApiRequest.call(this, 'PUT', `/events/${eventId}`, body);
					}
					if (operation === 'delete') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/events/${eventId}`);
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