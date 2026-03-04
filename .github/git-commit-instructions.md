# Git Commit Instructions

## Commit Message Format

This project uses **Conventional Commits** enforced by commitlint. All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

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

Use scopes to indicate the area of change:

- **app**: Changes to the main application
- **lib**: Changes to shared libraries
- **ui**: UI components or styling changes
- **api**: API-related changes
- **config**: Configuration changes
- **deps**: Dependency updates

## Examples

### Good Commit Messages

```bash
feat: add user authentication system
feat(ui): implement responsive navigation component
fix(auth): resolve login form validation issue
docs: update installation instructions
style: format code with prettier
refactor(api): simplify user data fetching logic
test(auth): add unit tests for login component
chore(deps): update react to v18.3.0
perf(ui): optimize image loading performance
ci: add automated testing workflow
```

### Bad Commit Messages

```bash
# ❌ No type
Update README

# ❌ Wrong case
Fix: button styling issue

# ❌ Too vague
feat: add stuff

# ❌ Too long (over 72 characters)
feat: add a really comprehensive user authentication system with login, logout, password reset, email verification, and session management

# ❌ Wrong format
Added new feature for users
```

## Message Guidelines

### Subject Line (Header)

- **Length**: Maximum 72 characters
- **Case**: Use lowercase for type and description
- **Tense**: Use imperative mood ("add" not "added" or "adds")
- **Punctuation**: No period at the end

### Body (Optional)

- Use when you need to explain **what** and **why**
- Wrap at 72 characters
- Separate from subject with a blank line
- Use bullet points if needed

### Footer (Optional)

- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: Name <email>`

## Automated Enforcement

The project uses:

- **Pre-commit hooks**: Automatically format and lint code before commit
- **Commitlint**: Validates commit message format
- **lint-staged**: Only processes staged files for faster execution

## Workflow

1. **Stage your changes**: `git add .`
2. **Commit with proper message**: `git commit -m "feat: add user dashboard"`
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
- **Break down large changes**: Multiple small commits are better than one large commit

## Emergency Bypass

In rare cases, you can bypass hooks with:

```bash
git commit --no-verify -m "emergency fix"
```

**Use sparingly** - this skips all quality checks!
