# WRPay API OpenAPI Specification

This repository contains the OpenAPI specification for the WRPay API, split into multiple files for better maintainability.

## Structure

```
.
├── openapi.yaml          # Main OpenAPI file (paths are merged automatically)
├── redocly.yaml          # Redocly configuration
├── package.json          # NPM scripts and dependencies
├── bundled.yaml          # Generated bundled file (created by npm run bundle)
├── components/
│   ├── security.yaml     # Security schemes
│   ├── responses.yaml    # Common response definitions
│   └── schemas.yaml      # Common schema definitions
└── paths/
    ├── payments.yaml           # Payment endpoints
    ├── transactions.yaml       # Transaction endpoints
    ├── wallets.yaml            # Wallet endpoints
    ├── withdraw-accounts.yaml  # Withdraw account endpoints
    └── withdrawals.yaml        # Withdrawal endpoints
```

## Setup

Install dependencies:

```bash
npm install
```

## Usage

### Merge Paths

Merge all path files into the main `openapi.yaml`:

```bash
npm run merge
```

### Bundle with Redocly

Bundle the OpenAPI specification into a single file (automatically merges paths first):

```bash
npm run bundle
```

This creates `bundled.yaml` which contains the complete, bundled OpenAPI specification.

### Lint

Lint the OpenAPI specification:

```bash
npm run lint
```

### Preview Documentation

Preview the API documentation locally:

```bash
npm run preview
```

**Note**: The `sidebars.yaml` file is used by Redocly Portal (hosted platform) for navigation. When using `redocly build-docs` for standalone HTML builds, only the OpenAPI spec is rendered. Markdown reference files (in `reference/`) are not included in standalone builds. To use sidebars and markdown files, you need to use Redocly Portal or embed the content into the OpenAPI spec.

### Build for Production

Build static HTML documentation:

```bash
npm run build
```

This creates a `dist/` directory with:
- `index.html` - Interactive API documentation
- `bundled.yaml` - Complete OpenAPI specification
- Logo and favicon assets

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   
   Or deploy to production:
   ```bash
   vercel --prod
   ```

3. **Automatic Deployments**: 
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on every push to your main branch
   - The `vercel.json` configuration handles the build and routing

**What happens during deployment:**
- Vercel runs `npm run build` which:
  1. Merges all path files into `openapi.yaml`
  2. Bundles the OpenAPI spec into `bundled.yaml`
  3. Generates static HTML documentation in `dist/`
- Serves the `dist/` directory as a static site
- All routes redirect to `index.html` for client-side routing

### Manual Deployment

You can also manually deploy the `dist/` folder to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file hosting

## Workflow

1. **Edit** the split files in `paths/` directory
2. **Merge** paths: `npm run merge` (or it runs automatically with `npm run bundle`)
3. **Bundle** with Redocly: `npm run bundle` to create `bundled.yaml`
4. **Use** `bundled.yaml` with tools that require a single OpenAPI file

## Common Responses

The API uses standardized response components for consistency:

- **422 ValidationError** - Used for validation failures with field-specific errors
- **404 NotFound** - Used when a requested resource is not found
- **500 ServerError** - Used for internal server errors
- **401 Unauthorized** - Used when authentication is required or invalid

These are defined in `components/responses.yaml` and `components/schemas.yaml` and referenced throughout the API specification using `$ref`.

## Notes

- The main `openapi.yaml` file has an empty `paths: {}` object - paths are merged from the split files automatically
- Edit paths in the `paths/` directory for easier maintenance
- The `bundled.yaml` file is generated and should not be edited manually
- Components (security schemes, responses, schemas) are referenced via `$ref` and work natively with Redocly
- Common responses are standardized and reused across all endpoints for consistency

