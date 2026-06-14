# Contributing to Digital Talent Management System (DTMS)

Thank you for your interest in contributing to DTMS! We welcome contributions from developers of all skill levels. To maintain a high quality codebase, please follow the guidelines below.

## Getting Started

1. **Fork the Repository**: Create a fork of this repository to your own account.
2. **Clone the Repository**: Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RYNIXSOFT-1ST-MONTH-PROJECT-digital-talend-monitoring-system.git
   cd RYNIXSOFT-1ST-MONTH-PROJECT-digital-talend-monitoring-system
   ```
3. **Setup Environments**: 
   - Follow the instructions in [client/README.md](client/README.md) and the root README to configure your local `.env` files based on the `.env.example` templates in both `client` and `server`.

## Branching Guidelines

- Create a descriptive branch name for your changes:
  - `feat/feature-name` for new features
  - `fix/bug-name` for bug fixes
  - `docs/doc-update` for documentation changes
- Always pull the latest changes from `main` before starting work:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feat/your-feature
  ```

## Development and Coding Standards

- **Code Quality**: Ensure code is clean, well-commented where appropriate, and formatted.
- **Linting**: Run ESLint in the client folder to check for errors before committing:
  ```bash
  cd client
  npm run lint
  ```
- **Testing**: Test your changes on multiple screen sizes (responsiveness is a critical feature of the DTMS dashboard).

## Submitting a Pull Request

1. **Push Changes**: Push your branch to your forked repository:
   ```bash
   git push origin feat/your-feature
   ```
2. **Open a Pull Request**: Submit a PR to the `main` branch of the original repository.
3. **PR Template**: Fill out the Pull Request template completely, listing:
   - What changes were made.
   - What issues are resolved.
   - Verification steps taken.

## License

By contributing to this repository, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
