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
