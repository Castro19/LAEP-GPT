# Contributing to PolyLink

Thank you for your interest in contributing to PolyLink! This document provides guidelines and instructions for contributing to the project.

## Development Environment Setup

1. Follow the installation instructions in the README.md file
2. Run the setup script to configure your development environment:

   ```sh
   ./setup-dev.sh
   ```

   This script will install the essential VSCode extensions:

   - ESLint for code quality
   - Prettier for code formatting
   - TypeScript Next for TypeScript support
   - GitLens for enhanced Git integration
   - Docker for container management
   - Remote Containers for development in containers

   If the script fails to install some VSCode extensions automatically, you can install them manually:

   - Open VSCode
   - Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for and install each of the recommended extensions listed in the README.md file

3. Make sure ESLint is working correctly:
   ```sh
   npm run lint
   ```
   If you see ESLint warnings in the terminal but not in VSCode, try restarting VSCode.

## Code Style and Quality

We use ESLint and Prettier to maintain consistent code style and quality. Please ensure your code follows these guidelines:

- Run ESLint before submitting a pull request:
  ```sh
  npm run lint
  ```
- Fix any ESLint warnings or errors
- Format your code with Prettier:
  ```sh
  npm run format
  ```

## Git Workflow

We use GitLens to enhance our Git workflow. Here are some tips for effective collaboration:

- Use GitLens to view file history and blame information
- Create feature branches for your work
- Write descriptive commit messages
- Keep your branches up to date with the main branch

## Pull Request Process

1. Create a new branch for your feature or bugfix:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them with descriptive commit messages
3. Push your branch to the remote repository:
   ```sh
   git push origin feature/your-feature-name
   ```
4. Create a pull request from your branch to the main branch
5. Ensure your pull request description clearly describes the problem and solution
6. Include any relevant issue numbers in your pull request description

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example:

```
feat: add user authentication
```

## Issue Reporting

When reporting issues, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment information (OS, browser, etc.)

## Questions and Support

If you have any questions or need support, please email `help@polylink.dev`.

Thank you for contributing to PolyLink!

## 🔄 Creating a Pull Request

### 🛠 1. Check for an Existing Issue

Before starting work, make sure there's an **open issue** for your contribution.

- Browse [GitHub Issues](https://github.com/Castro19/LAEP-GPT/issues).
- If no issue exists, **create one** before proceeding.

### 🌱 2. Create a New Branch

Name your branch based on the **issue number** and type of work:

```sh
git checkout -b issue-XX-short-description
```

- **Example:**
  - `issue-45-add-dark-mode`
  - `issue-78-fix-login-bug`
  - `issue-102-update-readme`

### 💾 3. Make Changes & Commit

After making your changes, **commit with a descriptive message**:

```sh
git add .
git commit -m "✨ [#XX] Short description of changes"
```

- The issue number (`#XX`) **must** be included.

### 🚀 4. Push Your Branch to GitHub

```sh
git push origin issue-XX-short-description
```

### 🔄 5. Open a Pull Request (PR)

1. Navigate to the main repository on GitHub.
2. Click **"Compare & pull request."**
3. Fill out the PR template and include:
   - A **link to the issue** (e.g., `Closes #XX`).
   - A short description of your changes.
4. Submit the PR and **wait for review**.

---

## ✅ Contribution Guidelines

- **Always** create an issue **before** working on a feature or bug fix.
- Use the **issue number** in the branch name (e.g., `issue-XX-short-description`).
- Use **descriptive commit messages** (`✨ [#XX] Add feature: Short description`).
- Ensure all **tests pass before submitting a PR**.
- **PRs must be reviewed & approved** before merging.

---

## 💬 Need Help?

If you have any questions:

- Join the **PolyLink Discord** (link TBD)
- Start a discussion in [GitHub Discussions](https://github.com/PolyLink-OpenSource/PolyLink/discussions)
- Open an issue if you find a bug

Happy Coding! 🚀
**- The PolyLink Team**
