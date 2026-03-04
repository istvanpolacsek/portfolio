# GitHub Copilot Instructions

## Project Overview

This is an Nx monorepo portfolio project using Yarn 4.12.0 as the package manager with modern tooling setup.

## Technology Stack

- **Monorepo**: Nx 22.5.2
- **Package Manager**: Yarn 4.12.0 (Berry with PnP)
- **Frontend**: Next.js (planned)
- **Styling**: styled-components or Emotion
- **Browser Support**: Modern browsers (excludes IE11, Opera Mini)

## Code Standards & Tooling

### Linting & Formatting

- **ESLint 9.39.3**: Code quality and best practices
- **Prettier 3.8.1**: Code formatting with import sorting
- **Stylelint 17.4.0**: CSS-in-JS linting for styled-components
- **Import Organization**: Automated sorting via @ianvs/prettier-plugin-sort-imports

### Git Workflow

- **Husky**: Pre-commit hooks for code quality
- **lint-staged**: Runs linters only on staged files
- **Commitlint**: Enforces conventional commit messages

## Development Guidelines

### File Structure

- Use Nx workspace structure: `apps/` and `libs/` directories
- Build outputs go to `apps/*/dist` and `libs/*/dist`
- Keep configurations at workspace root level

### Code Style

- Use single quotes for strings
- Add trailing commas in objects/arrays
- 80 character line width
- 2-space indentation
- Semicolons required

### Import Organization

Imports should be ordered as:

1. React imports (`react`, `react/*`)
2. Next.js imports (`next/*`)
3. Third-party packages
4. Internal imports (`@/*`)
5. Relative imports (`./`, `../`)

### CSS-in-JS

- Use styled-components for styling
- Follow component-based styling patterns
- Lint CSS-in-JS with Stylelint

### Browser Compatibility

Target modern browsers using Browserslist configuration:

- `defaults` (> 0.5%, last 2 versions, Firefox ESR, not dead)
- Exclude IE11 and Opera Mini

## Commands & Scripts

### Linting & Formatting

- `yarn nx format` - Format all files
- `yarn nx lint <project>` - Lint specific project
- `yarn lint:styles` - Lint CSS-in-JS
- `yarn nx affected:lint` - Lint only affected projects

### Development

- `yarn nx serve <app>` - Start development server
- `yarn nx build <app>` - Build for production
- `yarn nx test <app>` - Run tests

### Database Updates

- `yarn dlx update-browserslist-db@latest` - Update browser support data

## Best Practices

### When suggesting code:

1. Follow the established Prettier configuration
2. Use conventional commit message format
3. Organize imports according to the defined order
4. Use styled-components for styling
5. Target modern browser features
6. Follow Nx workspace conventions
7. Use TypeScript when applicable
8. Write meaningful component and variable names

### Avoid:

- Inline styles (use styled-components)
- Non-conventional commit messages
- IE11 specific workarounds
- Direct style manipulation
- Inconsistent import organization

### File Extensions

- Prefer `.tsx` for React components
- Use `.ts` for utility functions
- Use `.js` only when TypeScript isn't needed
- Config files can be `.js` or `.json` based on complexity

## Nx Specific Guidelines

- Use Nx generators for creating new projects/libraries
- Leverage Nx caching for faster builds
- Use project-specific configurations when needed
- Follow the affected commands for efficient CI/CD
