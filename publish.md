# Publishing Guide

This guide explains how to publish the n8n-nodes-axonaut package to npm.

## Prerequisites

1. **npm account**: Make sure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. **Build the project**: Ensure the project builds successfully:
   ```bash
   npm install
   npm run build
   ```

3. **Test locally**: Test the node in your local n8n installation:
   ```bash
   # In the node directory
   npm link
   
   # In your n8n installation directory
   npm link n8n-nodes-axonaut
   ```

## Publishing Steps

1. **Update version**: Update the version in `package.json`:
   ```json
   {
     "version": "0.1.0"
   }
   ```

2. **Update changelog**: Add your changes to `CHANGELOG.md`.

3. **Lint and format**: Ensure code quality:
   ```bash
   npm run lint
   npm run format
   ```

4. **Build**: Create the production build:
   ```bash
   npm run build
   ```

5. **Publish**: Publish to npm:
   ```bash
   npm publish --access public
   ```

## Verification

After publishing, verify the package is available:
1. Visit https://www.npmjs.com/package/n8n-nodes-axonaut
2. Try installing it in a test n8n environment

## Automated Publishing (Optional)

You can set up GitHub Actions for automated publishing:

1. Add npm token to GitHub secrets as `NPM_TOKEN`
2. Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Important Notes

- The package name `n8n-nodes-axonaut` must start with `n8n-nodes-`
- Include the keyword `n8n-community-node-package` in package.json
- Ensure all files in the `dist/` directory are included
- Test thoroughly before publishing
- Follow semantic versioning (semver)

## Troubleshooting

- **Build errors**: Check TypeScript configuration and dependencies
- **Publishing errors**: Verify npm login and package name availability
- **Installation issues**: Ensure package.json n8n configuration is correct

