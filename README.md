# JES Water Treatment Reports

A web application for generating water treatment field analysis and service reports for Jasper Equipment & Supply.

## Features

- Dynamic sections for boilers, support systems, and closed loops
- Real-time PDF preview
- PDF report generation with company branding
- Microsoft 365 authentication
- Form data persistence via localStorage

## Deployment

This application is deployed via GitHub Pages using GitHub Actions.

**Required Secrets** (Settings → Secrets → Actions):
- `AZURE_CLIENT_ID` - Azure AD app client ID
- `AZURE_TENANT_ID` - Azure AD tenant ID

**Azure AD Configuration:**
- Platform: Single-page application (SPA)
- Redirect URI: `https://rrumfelt-matrix.github.io/jes-water-treatment-reports`

## License

Proprietary - Jasper Equipment & Supply
