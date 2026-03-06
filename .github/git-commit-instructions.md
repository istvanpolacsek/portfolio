# Git Commit Instructions

## Commit Message Format

This project uses **Conventional Commits** enforced by commitlint. All commit messages must follow this format:

```
<type>(scope): <description>

<body>

[optional footer(s)]
```

**Required Components:**

- **Type**: Must be one of the defined commit types
- **Scope**: Must specify the area of change (cannot be omitted)
- **Body**: Must be a single, simple sentence explaining the change
- **Footer**: Optional for GitHub issue references and other metadata

## Commit Types

### Primary Types

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation changes
- **style**: Formatting changes (white-space, formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Additional Types

- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Scope Guidelines

**Required**: Every commit must include a scope to indicate the area of change:

- **app**: Changes to the main application
- **lib**: Changes to shared libraries
- **ui**: UI components or styling changes
- **api**: API-related changes
- **config**: Configuration changes
- **deps**: Dependency updates
- **auth**: Authentication and authorization
- **db**: Database-related changes
- **tests**: Test-related changes
- **docs**: Documentation-specific scope

## Branch Naming Convention

Use the following branch naming pattern for automatic GitHub issue referencing:

```
<type>/<issue-number>/<description>
```

**Important**: When your branch starts with one of the primary commit types (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`), your commit messages **must** use the same type to maintain consistency.

### Examples

- `feat/123/user-authentication` → Commits must use `feat:` type
- `fix/456/login-validation` → Commits must use `fix:` type
- `chore/1/storybook` → Commits must use `chore:` type
- `docs/789/api-documentation` → Commits must use `docs:` type

When working on a branch following this convention, include the issue number in your commit footer:

```
Refs: #123
```

## Examples

### Good Commit Messages

```bash
feat(auth): add user authentication system

This implements JWT-based authentication with login and logout functionality.

Refs: #123
```

```bash
feat(ui): implement responsive navigation component

The navigation now adapts to different screen sizes using CSS Grid.

Refs: #456
```

```bash
fix(auth): resolve login form validation issue

The form now properly validates email format before submission.

Refs: #789
```

```bash
docs(readme): update installation instructions

Added step-by-step guide for setting up the development environment.
```

```bash
style(ui): format code with prettier

Applied consistent formatting across all component files.
```

```bash
refactor(api): simplify user data fetching logic

Removed redundant API calls and consolidated user data retrieval.

Refs: #321
```

```bash
test(auth): add unit tests for login component

Created comprehensive test coverage for all login scenarios.

Refs: #654
```

```bash
chore(deps): update react to v18.3.0

Upgraded React to latest stable version for security improvements.
```

```bash
chore(config): add storybook setup

Configured Storybook for component development and documentation.

Refs: #1
```

```bash
perf(ui): optimize image loading performance

Implemented lazy loading and WebP format for faster page loads.

Refs: #987
```

```bash
ci(github): add automated testing workflow

Set up GitHub Actions for continuous integration testing.
```

### Bad Commit Messages

```bash
# ❌ No type
Update README

# ❌ No scope
feat: add user authentication

# ❌ No body
feat(auth): add user authentication system

# ❌ Wrong case
Fix: button styling issue

# ❌ Too vague
feat(ui): add stuff

# ❌ Too long (over 72 characters)
feat(auth): add a really comprehensive user authentication system with login, logout, password reset, email verification, and session management

# ❌ Wrong format
Added new feature for users

# ❌ Body with bullet points (should be single sentence)
feat(ui): implement navigation component

- Added responsive design
- Implemented dropdown menus
- Added accessibility features

# ❌ Body with multiple sentences (should be single sentence)
feat(auth): add login functionality

This adds login functionality. It also includes validation. The UI is responsive too.

# ❌ Inconsistent type (on branch feat/123/user-auth but using chore: type)
chore(auth): add user authentication system

The system now supports JWT tokens for secure authentication.

# ❌ Inconsistent type (on branch fix/456/login-bug but using feat: type)
feat(auth): resolve login form validation issue

Fixed the email validation to work properly with all formats.
```

## Message Guidelines

### Subject Line (Header)

- **Length**: Maximum 72 characters
- **Case**: Use lowercase for type and description
- **Tense**: Use imperative mood ("add" not "added" or "adds")
- **Punctuation**: No period at the end

### Body (Required)

- **Required**: Every commit must include a body explaining the change
- **Format**: Must be a single, simple sentence
- **Content**: Explain **what** and **why** the change was made
- **Length**: Wrap at 72 characters
- **Separation**: Must be separated from subject with a blank line
- **Restrictions**:
  - No bullet points
  - No lists
  - No multiple sentences
  - No complex formatting

### Footer (Optional)

- **GitHub Issues**: Reference the issue number from your branch name using `Refs: #<issue-number>`
  - If your branch is `feat/123/user-auth`, include `Refs: #123`
  - If your branch is `chore/1/storybook`, include `Refs: #1`
- **Closing Issues**: `Closes #123` (when the commit resolves the issue)
- **Breaking Changes**: `BREAKING CHANGE: description`
- **Co-authors**: `Co-authored-by: Name <email>`

### Branch-to-Commit Reference Examples

| Branch Name                    | Commit Type Required | Commit Message Footer |
| ------------------------------ | -------------------- | --------------------- |
| `feat/123/user-authentication` | `feat:`              | `Refs: #123`          |
| `fix/456/login-validation`     | `fix:`               | `Refs: #456`          |
| `chore/1/storybook`            | `chore:`             | `Refs: #1`            |
| `docs/789/api-documentation`   | `docs:`              | `Refs: #789`          |

## Automated Enforcement

The project uses:

- **Pre-commit hooks**: Automatically format and lint code before commit
- **Commitlint**: Validates commit message format
- **lint-staged**: Only processes staged files for faster execution

## Workflow

1. **Stage your changes**: `git add .`
2. **Commit with proper message**:

   ```bash
   git commit -m "feat(ui): add user dashboard

   This creates a responsive dashboard for user account management."
   ```

3. **Hooks run automatically**:
   - ESLint fixes code issues
   - Prettier formats code
   - Stylelint fixes CSS-in-JS
   - Commitlint validates message format
4. **If validation passes**: Commit succeeds
5. **If validation fails**: Fix issues and try again

## Tips

- **Keep commits atomic**: One logical change per commit
- **Write descriptive messages**: Others should understand the change without looking at code
- **Use present tense**: "add feature" not "added feature"
- **Reference issues**: Link commits to GitHub issues when relevant
- **Match branch type**: When on `feat/123/feature` branch, use `feat:` commit type
- **Use branch naming convention**: Extract issue number from branch name (e.g., `feat/123/feature` → `Refs: #123`)
- **Break down large changes**: Multiple small commits are better than one large commit

## Emergency Bypass

In rare cases, you can bypass hooks with:

```bash
git commit --no-verify -m "fix(critical): resolve production server crash

Emergency fix for memory leak causing server instability."
```

**Use sparingly** - this skips all quality checks!
