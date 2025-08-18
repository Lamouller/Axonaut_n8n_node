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
			// Employee ID field
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
			// Company selector for employee operations
			{
				displayName: 'Company',
				name: 'companyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCompanies',
				},
				displayOptions: {
					show: {
						resource: ['employee'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The company this employee belongs to',
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

				if (resource === 'employee') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i);
						const companyId = this.getNodeParameter('companyId', i);
						const body: any = {
							company_id: companyId,
						};

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

