# Portfolio

A modern portfolio website built with Nx monorepo architecture and cutting-edge development tooling.

## Tech Stack

- **Nx 22.5.2** - Monorepo management
- **Yarn 4.12.0** - Package manager with PnP
- **Next.js** - React framework (planned)
- **styled-components** - CSS-in-JS styling
- **TypeScript** - Type safety

## Development Setup

### Prerequisites

- Node.js 18+ (see `.nvmrc`)
- Yarn 4.12.0

### Installation

```bash
yarn install
```

### Development Commands

```bash
# Start development server
yarn nx serve <app-name>

# Build for production
yarn nx build <app-name>

# Lint and format
yarn nx lint <app-name>
yarn nx format

# Run tests
yarn nx test <app-name>
```

## Code Quality

This project enforces high code quality standards through:

- **ESLint 9.39.3** - Code linting
- **Prettier 3.8.1** - Code formatting with import sorting
- **Stylelint 17.4.0** - CSS-in-JS linting
- **Husky + lint-staged** - Pre-commit hooks
- **Commitlint** - Conventional commit messages

### Commit Format

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
```

## Browser Support

Targets modern browsers (excludes IE11, Opera Mini). See `browserslist` in `package.json`.

## Project Structure

```
├── apps/          # Applications
├── libs/          # Shared libraries
├── .github/       # GitHub workflows and Copilot instructions
└── tools/         # Build tools and scripts
```

Built with ❤️ using modern development practices.
