# n8n-nodes-axonaut

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

This is an n8n community node that provides integration with [Axonaut](https://axonaut.com), a comprehensive CRM and business management platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-axonaut` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node in n8n.

## Operations

This node supports the following operations:

### Companies
- **Create** - Create a new company
- **Get** - Retrieve a company by ID
- **Get Many** - Retrieve all companies
- **Update** - Update an existing company
- **Delete** - Delete a company

### Contacts
- **Create** - Create a new contact
- **Get** - Retrieve a contact by ID
- **Get Many** - Retrieve all contacts
- **Update** - Update an existing contact
- **Delete** - Delete a contact

### Deals
- **Create** - Create a new deal
- **Get** - Retrieve a deal by ID
- **Get Many** - Retrieve all deals
- **Update** - Update an existing deal
- **Delete** - Delete a deal

### Invoices
- **Create** - Create a new invoice
- **Get** - Retrieve an invoice by ID
- **Get Many** - Retrieve all invoices
- **Update** - Update an existing invoice
- **Delete** - Delete an invoice

### Products
- **Create** - Create a new product
- **Get** - Retrieve a product by ID
- **Get Many** - Retrieve all products
- **Update** - Update an existing product
- **Delete** - Delete a product

### Projects
- **Create** - Create a new project
- **Get** - Retrieve a project by ID
- **Get Many** - Retrieve all projects
- **Update** - Update an existing project
- **Delete** - Delete a project

## Credentials

To use this node, you need to configure Axonaut API credentials:

1. **API Key**: Your Axonaut API key
2. **Base URL**: The Axonaut API base URL (default: https://axonaut.com/api/v2)

### How to get your API Key

1. Log in to your Axonaut account
2. Go to your account settings
3. Navigate to the API section
4. Generate or copy your API key

## Compatibility

- Minimum n8n version: 0.238.0
- Tested with n8n version: 1.0.0+

## Usage

1. Add the Axonaut node to your workflow
2. Configure your Axonaut API credentials
3. Select the resource (Company, Contact, Deal, etc.)
4. Choose the operation you want to perform
5. Configure the required parameters
6. Execute the workflow

### Example Workflow

Here's a simple example of creating a company:

1. Use a **Manual Trigger** or **Schedule Trigger**
2. Add the **Axonaut** node
3. Set:
   - Resource: Company
   - Operation: Create
   - Additional Fields: Name, Email, Phone, etc.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Axonaut API Documentation](https://axonaut.com/api/v2/doc)
- [Axonaut Website](https://axonaut.com)

## Development

### Setup

1. Clone this repository
2. Run `npm install`
3. Build the node: `npm run build`

### Building

- `npm run build` - Build the node
- `npm run dev` - Build and watch for changes
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Testing

Link the built node to n8n for testing:

```bash
# In the node directory
npm run build
npm link

# In your n8n installation directory
npm link n8n-nodes-axonaut
```

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

## Support

If you encounter any issues or have questions, please:

1. Check the [Axonaut API documentation](https://axonaut.com/api/v2/doc)
2. Review the [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
3. Open an issue on this repository

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
