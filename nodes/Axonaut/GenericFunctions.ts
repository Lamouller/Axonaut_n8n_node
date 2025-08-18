import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	NodeApiError,
	NodeOperationError,
	IRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

/**
 * Make an API request to Axonaut
 */
export async function axonautApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('axonautApi');

	const options: IRequestOptions = {
		headers: {
			'userApiKey': credentials.apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		method,
		body,
		qs: query,
		url: `${credentials.baseUrl}${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to Axonaut and return all results
 * by paginating through all pages
 */
export async function axonautApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;
	query.page = 1;
	query.per_page = query.limit || 100;

	do {
		responseData = await axonautApiRequest.call(this, method, endpoint, body, query);
		
		if (Array.isArray(responseData)) {
			returnData.push.apply(returnData, responseData);
		} else if (responseData.data && Array.isArray(responseData.data)) {
			returnData.push.apply(returnData, responseData.data);
		} else {
			returnData.push(responseData);
		}

		query.page++;
	} while (responseData && responseData.length !== 0 && responseData.length === query.per_page);

	return returnData;
}

