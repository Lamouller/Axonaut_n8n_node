# Development Guide

This guide will help you set up and develop the n8n-nodes-axonaut community node.

## Quick Start

1. **Run the setup script** (recommended):
   ```bash
   ./setup.sh
   ```

2. **Manual setup**:
   ```bash
   npm install
   npm run build
   ```

## Project Structure

```
n8n-nodes-axonaut/
├── credentials/
│   └── AxonautApi.credentials.ts    # API credentials configuration
├── nodes/
│   └── Axonaut/
│       ├── Axonaut.node.ts         # Main node implementation
│       ├── GenericFunctions.ts     # API helper functions
│       └── axonaut.svg             # Node icon
├── dist/                           # Built files (auto-generated)
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript configuration
├── gulpfile.js                     # Build configuration
└── README.md                       # Documentation
```

## Development Workflow

### 1. Code Changes

Make your changes to the TypeScript files in `credentials/` or `nodes/` directories.

### 2. Build

```bash
npm run build
```

### 3. Test Locally

Link the package to test it in your local n8n installation:

```bash
# In the node directory
npm link

# In your n8n installation directory
npm link n8n-nodes-axonaut-antislash
```

### 4. Development with Auto-rebuild

Watch for changes and automatically rebuild:

```bash
npm run dev
```

## Code Quality

### Linting

```bash
npm run lint          # Check for issues
npm run lintfix       # Fix auto-fixable issues
```

### Formatting

```bash
npm run format        # Format with Prettier
```

## Testing

### Manual Testing

1. Start your local n8n instance
2. Create a new workflow
3. Add the Axonaut node
4. Configure credentials
5. Test different operations

### API Testing

Use the node's built-in credential test to verify API connectivity:

1. Go to Credentials → Axonaut API
2. Add your API key
3. Click "Test" to verify the connection

## API Integration

### Axonaut API Reference

- **Base URL**: `https://axonaut.com/api/v2`
- **Authentication**: API Key in `userApiKey` header
- **Documentation**: https://axonaut.com/api/v2/doc

### Adding New Operations

1. **Update the node description** in `Axonaut.node.ts`:
   - Add new operation to the `options` array
   - Add any required parameters

2. **Implement the operation logic** in the `execute` method:
   ```typescript
   if (operation === 'newOperation') {
     // Implementation here
     responseData = await axonautApiRequest.call(this, 'GET', '/endpoint');
   }
   ```

3. **Add helper functions** if needed in `GenericFunctions.ts`

### API Request Structure

```typescript
// GET request
responseData = await axonautApiRequest.call(this, 'GET', '/companies');

// POST request with body
responseData = await axonautApiRequest.call(this, 'POST', '/companies', body);

// GET with query parameters
responseData = await axonautApiRequest.call(this, 'GET', '/companies', {}, query);
```

## Common Issues

### Build Errors

- **TypeScript errors**: Check type definitions and imports
- **Missing dependencies**: Run `npm install`
- **Path issues**: Verify file paths in imports

### Runtime Errors

- **API authentication**: Verify API key and base URL
- **Network issues**: Check internet connection and API status
- **Rate limiting**: Implement proper error handling

### N8N Integration Issues

- **Node not appearing**: Clear n8n cache and restart
- **Icon not showing**: Ensure SVG file is in correct location
- **Credentials not working**: Check credential configuration

## Best Practices

### Code Style

- Follow the existing code style
- Use TypeScript types extensively
- Add proper error handling
- Include descriptive comments

### API Calls

- Always use the `axonautApiRequest` helper
- Implement proper pagination for list operations
- Handle API rate limits gracefully
- Provide meaningful error messages

### User Experience

- Use clear, descriptive parameter names
- Provide helpful descriptions for all fields
- Group related parameters logically
- Include examples in descriptions

## Debugging

### Enable Debug Logging

Set environment variable for detailed logs:

```bash
export N8N_LOG_LEVEL=debug
```

### Common Debug Points

1. **API requests**: Log request/response data
2. **Parameter validation**: Check parameter extraction
3. **Error handling**: Verify error messages are helpful

### Debugging Tools

- **Browser DevTools**: For frontend debugging
- **n8n Editor**: Built-in workflow testing
- **Postman**: For API endpoint testing

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Update documentation**
6. **Submit a pull request**

### Pull Request Guidelines

- Include clear description of changes
- Add/update tests for new functionality
- Ensure all existing tests pass
- Update documentation as needed
- Follow the existing code style

## Resources

- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [Axonaut API Documentation](https://axonaut.com/api/v2/doc)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [n8n Community](https://community.n8n.io/)

