# Nimloth

A modern genealogy and family tree management web application built with Django and Angular.

[![Django CI](https://github.com/Yarvid/nimloth/actions/workflows/django.yml/badge.svg)](https://github.com/Yarvid/nimloth/actions/workflows/django.yml)

## Overview

Nimloth is a full-stack web application that allows users to create, view, and manage person records organized in a hierarchical family tree structure. Track family relationships, biographical information, and visualize your family history with an intuitive interface.

### Key Features

- 📊 **Hierarchical Family Tree** - Self-referential relationships for mothers and fathers
- 👤 **Comprehensive Person Records** - Track names, birth/death info, locations, and more
- 🎨 **Modern UI** - Built with Angular Material for a clean, responsive interface
- 🔒 **Type-Safe** - TypeScript frontend with strict typing enabled
- 🚀 **REST API** - Django REST Framework backend for flexible integration
- 🐳 **Docker Ready** - Containerized development environment
- ✅ **Code Quality** - Pre-commit hooks with Black, Flake8, ESLint, and Prettier

## Technology Stack

**Backend:**
- Django 4.2.3 + Django REST Framework 3.14.0
- Python 3.9
- SQLite3 (development)

**Frontend:**
- Angular 19.0.0
- TypeScript 5.6.2
- Angular Material 19.0.0
- RxJS 7.8.1

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- VSCode Dev Container

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) (Windows users)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yarvid/nimloth.git
   cd nimloth
   ```

2. **Open in VSCode:**
   ```bash
   code .
   ```

3. **Reopen in Dev Container:**
   - VSCode will prompt you to "Reopen in Container"
   - Click the prompt or use Command Palette: `Dev Containers: Reopen in Container`
   - Wait for the container to build and start

4. **Start the services:**
   ```bash
   docker-compose up
   ```

5. **Access the application:**
   - **Frontend:** http://localhost:4200
   - **Backend API:** http://localhost:8000/api/person/
   - **Django Admin:** http://localhost:8000/admin/

### Manual Installation (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Development

### Project Structure

```
nimloth/
├── backend/           # Django REST API
│   ├── persons/       # Main app (Person model, views, serializers)
│   └── nimloth/       # Django project configuration
├── frontend/          # Angular application
│   └── src/app/       # Components, services, models
├── .devcontainer/     # VSCode Dev Container config
├── .github/           # CI/CD workflows
└── docker-compose.yml # Multi-container orchestration
```

### Common Tasks

**Run tests:**
```bash
# Backend (Django)
cd backend
python manage.py test

# Frontend (Angular)
cd frontend
npm run test
```

**Create database migrations:**
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

**Generate Angular component:**
```bash
cd frontend
ng generate component component-name
```

**Run pre-commit hooks:**
```bash
pre-commit run --all-files
```

### Code Quality

This project uses automated code quality tools:

- **Python:** Black (formatting), Flake8 (linting), isort (imports)
- **TypeScript:** Prettier (formatting), ESLint (linting)
- **Pre-commit hooks** enforce these standards automatically

Install pre-commit hooks:
```bash
pip install pre-commit
pre-commit install
```

## Data Model

The core `Person` model includes:

- **Names:** first_name, middle_name, last_name, birth_name, artist_name
- **Birth:** date_of_birth, place_of_birth
- **Death:** date_of_death, place_of_death, cause_of_death
- **Family:** mother (FK), father (FK)
- **Demographics:** gender (M/F/N/U)
- **Audit:** created_on, modified_on, created_by, modified_by

Helper methods: `full_name()`, `time_since_birth()`, `time_since_death()`

## API Documentation

### Endpoints

- `GET /api/person/` - List all persons
- `POST /api/person/` - Create new person
- `GET /api/get-csrf-token/` - Get CSRF token

**CORS:** Configured for `http://localhost:4200` in development

## Contributing

We welcome contributions! Please see [CLAUDE.md](CLAUDE.md) for detailed development guidelines.

### Development Setup

**Requirements:**
- Visual Studio Code
- Docker Desktop
- WSL 2 (Windows users)
- Git

**Setup Steps:**
1. Clone the repository into WSL 2
2. Open project in VS Code
3. Reopen in Dev Container (automatically installs dependencies)
4. Run `docker-compose up` to start services

**Before Committing:**
1. Ensure all pre-commit hooks pass
2. Run tests: `python manage.py test` (backend) and `npm test` (frontend)
3. Verify migrations are included if models changed
4. Follow commit message guidelines (imperative mood, descriptive)

### Code Conventions

**Backend (Python/Django):**
- PEP 8 compliant (enforced by Flake8)
- Black formatting (100 char line limit)
- snake_case for functions/variables
- Docstrings for complex methods

**Frontend (TypeScript/Angular):**
- ESLint strict mode (no `any` types)
- Prettier formatting (single quotes, 2-space indent)
- kebab-case for component selectors
- camelCase for properties

## Known Issues

- CSRF token handling needs investigation (frontend/backend mismatch)
- Some unit tests incomplete
- Docker Angular CLI version mismatch (Dockerfile uses v11, package.json uses v19)
- 55 security vulnerabilities in dependencies (see Dependabot alerts)

## Roadmap

- [ ] Fix CSRF token implementation
- [ ] Complete unit test coverage
- [ ] Implement authentication/authorization
- [ ] Add production database configuration (PostgreSQL)
- [ ] Enhance tree visualization features
- [ ] Add export functionality (PDF, GEDCOM)
- [ ] Implement file uploads (photos, documents)

## License

This project is currently unlicensed. Please contact the repository owner for usage rights.

## Support

For questions or issues:
- Open an issue on [GitHub Issues](https://github.com/Yarvid/nimloth/issues)
- See [CLAUDE.md](CLAUDE.md) for AI assistant guidance
- Check [GitHub Discussions](https://github.com/Yarvid/nimloth/discussions) for community support

---

**Note:** This project is under active development. Features and APIs may change.
