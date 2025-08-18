import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { axonautApiRequest } from './GenericFunctions';

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
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Deal',
						value: 'deal',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Product',
						value: 'product',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'company',
			},
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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new contact',
						action: 'Create a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact by ID',
						action: 'Get a contact',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all contacts',
						action: 'Get many contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a contact',
						action: 'Delete a contact',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['deal'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new deal',
						action: 'Create a deal',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a deal by ID',
						action: 'Get a deal',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get all deals',
						action: 'Get many deals',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a deal',
						action: 'Update a deal',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a deal',
						action: 'Delete a deal',
					},
				],
				default: 'get',
			},
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
						name: 'Create',
						value: 'create',
						description: 'Create a new invoice',
						action: 'Create an invoice',
					},
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
					{
						name: 'Update',
						value: 'update',
						description: 'Update an invoice',
						action: 'Update an invoice',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an invoice',
						action: 'Delete an invoice',
					},
				],
				default: 'get',
			},
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
			// Company ID field
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
			// Contact ID field
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the contact',
			},
			// Deal ID field
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['deal'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the deal',
			},
			// Invoice ID field
			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the invoice',
			},
			// Product ID field
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
			// Project ID field
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
			// Additional fields collection
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
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

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

				if (resource === 'contact') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'POST', '/contacts', body);
					}

					if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/contacts/${contactId}`);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/contacts', {}, { limit });
					}

					if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'PUT', `/contacts/${contactId}`, body);
					}

					if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/contacts/${contactId}`);
					}
				}

				if (resource === 'deal') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'POST', '/deals', body);
					}

					if (operation === 'get') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/deals/${dealId}`);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/deals', {}, { limit });
					}

					if (operation === 'update') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'PUT', `/deals/${dealId}`, body);
					}

					if (operation === 'delete') {
						const dealId = this.getNodeParameter('dealId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/deals/${dealId}`);
					}
				}

				if (resource === 'invoice') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'POST', '/invoices', body);
					}

					if (operation === 'get') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await axonautApiRequest.call(this, 'GET', `/invoices/${invoiceId}`);
					}

					if (operation === 'getAll') {
						const limit = this.getNodeParameter('limit', i);
						responseData = await axonautApiRequest.call(this, 'GET', '/invoices', {}, { limit });
					}

					if (operation === 'update') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

						Object.assign(body, additionalFields);

						responseData = await axonautApiRequest.call(this, 'PUT', `/invoices/${invoiceId}`, body);
					}

					if (operation === 'delete') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await axonautApiRequest.call(this, 'DELETE', `/invoices/${invoiceId}`);
					}
				}

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

				if (resource === 'project') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const body: any = {};

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

