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
 * Make an API request to Axonaut with pagination headers
 */
export async function axonautApiRequestWithPagination(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	page: number = 1,
	perPage: number = 100,
): Promise<any> {
	const credentials = await this.getCredentials('axonautApi');

	const options: IRequestOptions = {
		headers: {
			'userApiKey': credentials.apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'page': page.toString(),
			'per_page': perPage.toString(),
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
 * by paginating through all pages using header-based pagination
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
	let page = 1;
	const perPage = typeof query.limit === 'number' ? query.limit : 100;
	let resultCount = 0;
	
	// Remove limit from query since we handle pagination in headers
	const cleanQuery = { ...query };
	delete cleanQuery.limit;

	do {
		
		try {
			// First try with header-based pagination (required by most Axonaut endpoints)
			responseData = await axonautApiRequestWithPagination.call(this, method, endpoint, body, cleanQuery, page, perPage);
		} catch (headerError) {
			// If header pagination fails, fallback to query pagination for backward compatibility
			console.warn(`Header pagination failed for ${endpoint}, falling back to query pagination:`, headerError);
			
			const fallbackQuery = { ...cleanQuery, page, per_page: perPage };
			try {
				responseData = await axonautApiRequest.call(this, method, endpoint, body, fallbackQuery);
			} catch (queryError) {
				// If both methods fail, try without pagination
				console.warn(`Query pagination failed for ${endpoint}, trying without pagination:`, queryError);
				responseData = await axonautApiRequest.call(this, method, endpoint, body, cleanQuery);
				
				// If no pagination works, return the single response
				if (responseData) {
					if (Array.isArray(responseData)) {
						return responseData;
					} else if (responseData.data && Array.isArray(responseData.data)) {
						return responseData.data;
					} else {
						return [responseData];
					}
				}
				return [];
			}
		}
		
		if (Array.isArray(responseData)) {
			returnData.push.apply(returnData, responseData);
		} else if (responseData.data && Array.isArray(responseData.data)) {
			returnData.push.apply(returnData, responseData.data);
		} else {
			returnData.push(responseData);
		}

		page++;
		
		// Calculate result count for pagination control
		resultCount = Array.isArray(responseData) ? responseData.length : 
			(responseData.data && Array.isArray(responseData.data)) ? responseData.data.length : 1;
			
	} while (responseData && resultCount === perPage && page <= 50); // Safety limit of 50 pages

	return returnData;
}

