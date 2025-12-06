# CLAUDE.md - AI Assistant Guide for Nimloth

This file provides comprehensive guidance for AI assistants working with the Nimloth codebase.

## Project Overview

**Nimloth** is a genealogy/family tree web application that allows users to create, view, and manage person records organized in a hierarchical family tree structure.

- **Type:** Full-stack web application
- **Domain:** Genealogy and family tree management
- **Architecture:** Django REST API backend + Angular frontend
- **Development Stage:** Active development with focus on code quality

## Technology Stack

### Backend
- **Framework:** Django 4.2.3
- **Language:** Python 3.9
- **API:** Django REST Framework 3.14.0
- **Database:** SQLite3 (development)
- **Key Dependencies:**
  - django-cors-headers 4.2.0 (Cross-origin support)
  - django-extensions 3.2.3 (Development utilities)
  - python-dateutil 2.9.0 (Date calculations)

### Frontend
- **Framework:** Angular 19.0.0
- **Language:** TypeScript 5.6.2
- **UI Framework:** Angular Material 19.0.0
- **State Management:** RxJS 7.8.1
- **Styling:** SCSS (Angular Material theming)

### Development Environment
- **Containerization:** Docker & Docker Compose
- **IDE:** VSCode with Dev Container support
- **Version Control:** Git
- **CI/CD:** GitHub Actions (Django test pipeline)

## Repository Structure

```
/home/user/nimloth/
├── backend/                      # Django REST API
│   ├── manage.py                 # Django management script
│   ├── requirements.txt          # Production dependencies
│   ├── requirements-dev.txt      # Development dependencies
│   ├── nimloth/                  # Project configuration
│   │   ├── settings.py           # Django settings (CORS, apps, DB)
│   │   ├── urls.py               # URL routing
│   │   ├── wsgi.py               # WSGI server interface
│   │   └── asgi.py               # ASGI server interface
│   └── persons/                  # Main application
│       ├── models.py             # Person model (core data structure)
│       ├── views.py              # API endpoints
│       ├── serializers.py        # DRF serializers
│       ├── tests.py              # Unit tests
│       ├── admin.py              # Django admin configuration
│       └── migrations/           # Database migrations
├── frontend/                     # Angular application
│   ├── angular.json              # Angular CLI configuration
│   ├── package.json              # npm dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── .eslintrc.js              # ESLint rules
│   └── src/
│       ├── main.ts               # Angular bootstrap
│       ├── index.html            # HTML entry point
│       ├── styles.scss           # Global styles
│       └── app/
│           ├── app.module.ts     # Root module
│           ├── app.component.ts  # Root component
│           ├── person.service.ts # HTTP service for API calls
│           ├── models/
│           │   └── person.interface.ts  # TypeScript interfaces
│           ├── navbar/           # Navigation component
│           ├── person-card/      # Person display component
│           ├── create-modal/     # Person creation form
│           └── tree-visualization/  # Main tree view
├── .devcontainer/                # VSCode Dev Container setup
├── .github/workflows/            # CI/CD pipelines
├── .pre-commit-config.yaml       # Pre-commit hooks
├── docker-compose.yml            # Multi-container orchestration
├── setup.cfg                     # Flake8 configuration
└── README.md                     # User documentation
```

## Core Data Model

### Person Model (backend/persons/models.py)

The `Person` model is the central entity in the application:

```python
class Person(models.Model):
    # Names
    first_name = CharField(max_length=50, blank=True)
    middle_name = CharField(max_length=50, blank=True)
    last_name = CharField(max_length=50, blank=True)
    birth_name = CharField(max_length=50, blank=True)
    artist_name = CharField(max_length=50, blank=True)

    # Birth information
    date_of_birth = DateField(null=True)
    place_of_birth = CharField(max_length=100, blank=True)

    # Death information
    date_of_death = DateField(null=True)
    place_of_death = CharField(max_length=100, blank=True)
    cause_of_death = CharField(max_length=100, blank=True)

    # Family relationships (self-referential)
    mother = ForeignKey('self', related_name='mother_of')
    father = ForeignKey('self', related_name='father_of')

    # Demographics
    gender = CharField(choices=[M, F, N, U], default='U')

    # Audit trail
    created_on = DateField(auto_now_add=True)
    modified_on = DateField(auto_now=True)
    created_by = ForeignKey('self', related_name='created_persons')
    modified_by = ForeignKey('self', related_name='modified_persons')
```

**Key Methods:**
- `full_name()` - Returns concatenated first, middle, last name
- `time_since_birth()` - Returns age breakdown (years, months, days)
- `time_since_death()` - Returns time since death
- `time_since_modification()` - Returns time since last edit

**Database Migrations:**
- `0001_initial` - Created base Person table
- `0002_person_artist_name_person_birth_name_and_more` - Added extended name fields

### TypeScript Interface (frontend/src/app/models/person.interface.ts)

```typescript
export interface IPerson {
  id?: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_name: string;
  artist_name: string;
  date_of_birth: string | null;
  place_of_birth: string;
  date_of_death: string | null;
  place_of_death: string;
  cause_of_death: string;
  mother: number | null;  // Foreign key reference
  father: number | null;  // Foreign key reference
  gender: 'M' | 'F' | 'N' | 'U';
}
```

## API Endpoints

### Current Endpoints (backend/nimloth/urls.py)

- `GET /api/person/` - List all persons
- `POST /api/person/` - Create new person
- `GET /api/get-csrf-token/` - Get CSRF token for form submissions
- `GET /admin/` - Django admin interface

**CORS Configuration:**
- Allowed origins: `http://localhost:4200` (frontend dev server)
- Credentials: Enabled for CSRF token support

## Development Setup

### Prerequisites
- Docker Desktop
- Visual Studio Code
- WSL 2 (for Windows users)
- Git

### Quick Start

1. **Clone repository into WSL 2:**
   ```bash
   git clone <repository-url>
   cd nimloth
   ```

2. **Open in VSCode and reopen in Dev Container:**
   - VSCode will detect `.devcontainer/devcontainer.json`
   - Click "Reopen in Container" when prompted
   - Wait for container setup to complete

3. **Start services:**
   ```bash
   docker-compose up
   ```
   - Backend runs on `http://localhost:8000`
   - Frontend runs on `http://localhost:4200`

### Manual Development (without Docker)

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
npm start  # Runs ng serve
```

## Code Quality & Pre-commit Hooks

### Pre-commit Configuration

The repository uses `.pre-commit-config.yaml` with the following hooks:

#### General Hooks (all files)
- `trailing-whitespace` - Remove trailing whitespace
- `end-of-file-fixer` - Ensure files end with newline
- `check-yaml` - Validate YAML syntax
- `check-added-large-files` - Block files >500KB
- `mixed-line-ending` - Normalize to LF

#### Python/Django Hooks (backend/*.py)
- **Black (24.1.1)** - Code formatting (auto-fix)
- **Flake8 (6.1.0)** - Linting with django plugin
- **isort (5.13.2)** - Import sorting (auto-fix)

#### TypeScript/Angular Hooks (frontend/*.{ts,js,css,scss,html})
- **Prettier (v3.1.0)** - Code formatting (auto-fix)
- **ESLint (v8.56.0)** - Linting with Angular plugins

### Installing Pre-commit Hooks

```bash
# One-time setup
pip install pre-commit
pre-commit install

# Manual run
pre-commit run --all-files
```

### Flake8 Configuration (setup.cfg)

```ini
[flake8]
max-line-length = 100
exclude = .git, __pycache__, build, dist, *.pyc, */migrations/*
ignore = E226, W503
```

## Code Conventions

### Backend (Python/Django)

**Style Requirements:**
- **Formatting:** Black (automatic via pre-commit)
- **Line Length:** 100 characters max
- **Imports:** Sorted with isort (automatic)
- **Linting:** Must pass Flake8

**Naming Conventions:**
- Models: `PascalCase` (e.g., `Person`)
- Functions/methods: `snake_case` (e.g., `full_name()`)
- Variables: `snake_case` (e.g., `date_of_birth`)
- Constants: `UPPER_SNAKE_CASE`
- Private methods: `_leading_underscore`

**Django Patterns:**
- Use Django ORM for all database operations
- Create migrations for all model changes: `python manage.py makemigrations`
- Use ModelSerializer for API serialization
- Follow REST conventions for API design
- Use ForeignKey with `related_name` for reverse lookups
- Set `on_delete` explicitly (prefer `SET_NULL` or `CASCADE`)

**Import Organization (isort):**
```python
# Standard library
from datetime import date, datetime

# Third-party
from django.db import models
from dateutil.relativedelta import relativedelta

# Local
from .models import Person
```

### Frontend (TypeScript/Angular)

**Style Requirements:**
- **Formatting:** Prettier (automatic via pre-commit)
- **Linting:** ESLint with strict rules
- **Type Safety:** No `any` types allowed (`@typescript-eslint/no-explicit-any: error`)
- **Quotes:** Single quotes
- **Indentation:** 2 spaces

**Naming Conventions:**
- Components: `PascalCase` files + kebab-case selectors
  - File: `person-card.component.ts`
  - Selector: `app-person-card`
- Services: `PascalCase` with `Service` suffix (e.g., `PersonService`)
- Interfaces: `I` prefix (e.g., `IPerson`)
- Variables/Properties: `camelCase` (e.g., `dateOfBirth`)
- Constants: `UPPER_SNAKE_CASE`

**Angular Patterns:**
- Use standalone components where possible
- Inject services via constructor DI
- Use RxJS Observables for async operations
- Subscribe to Observables in templates with `async` pipe
- Use Angular Material components for UI consistency
- Organize by feature (not by file type)

**Component Structure:**
```typescript
@Component({
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss']
})
export class FeatureNameComponent implements OnInit {
  // Public properties (bound to template)

  // Private properties

  constructor(private service: MyService) {}

  ngOnInit(): void {}

  // Public methods (called from template)

  // Private methods
}
```

## Common Development Tasks

### Backend Tasks

**Run development server:**
```bash
cd backend
python manage.py runserver
```

**Create database migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Create superuser:**
```bash
python manage.py createsuperuser
```

**Run tests:**
```bash
python manage.py test
```

**Access Django shell:**
```bash
python manage.py shell
```

**Access Django admin:**
Navigate to `http://localhost:8000/admin/`

### Frontend Tasks

**Run development server:**
```bash
cd frontend
npm start  # Equivalent to ng serve
```

**Generate new component:**
```bash
ng generate component component-name
# Or use shortcuts: ng g c component-name
```

**Generate service:**
```bash
ng generate service service-name
```

**Build for production:**
```bash
npm run build  # Output to dist/nimloth
```

**Run tests:**
```bash
npm run test  # Runs Karma + Jasmine
```

**Run linting:**
```bash
ng lint
```

### Docker Tasks

**Start all services:**
```bash
docker-compose up
```

**Start in detached mode:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f
```

**Rebuild containers:**
```bash
docker-compose up --build
```

**Stop services:**
```bash
docker-compose down
```

## Testing Strategy

### Backend Testing (Django)
- **Framework:** Django TestCase (unittest-based)
- **Location:** `backend/persons/tests.py`
- **Run:** `python manage.py test`

**Test Structure:**
```python
from django.test import TestCase
from .models import Person

class PersonModelTestCase(TestCase):
    def setUp(self):
        # Create test data
        pass

    def test_feature(self):
        # Test implementation
        self.assertEqual(expected, actual)
```

### Frontend Testing (Angular)
- **Framework:** Karma + Jasmine
- **Location:** `*.spec.ts` files alongside components
- **Run:** `npm run test`

**Test Structure:**
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentName ]
    });
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Known Issues & Gotchas

### Critical Issues

1. **CSRF Token Not Stored (backend/persons/views.py)**
   - FIXME comment indicates CSRF cookie isn't being stored in browser
   - May affect form submissions from frontend
   - Location: `PersonCreateView.get()` method

2. **Incomplete Tests (backend/persons/tests.py)**
   - Test methods exist but have syntax errors (empty `assertEqual()` calls)
   - Tests will fail when run
   - Need to add actual test assertions

3. **Commented CSRF Handling (frontend)**
   - CSRF token fetching is commented out in `create-modal.component.ts`
   - May be related to backend CSRF issue
   - Needs investigation and resolution

4. **Docker Angular CLI Version Mismatch**
   - `frontend/Dockerfile` references Angular CLI v11.0.7
   - `package.json` uses Angular 19.0.0
   - Frontend container may fail to build or run
   - **Fix:** Update Dockerfile to use compatible Angular CLI version

### Important Notes

- **Database:** Using SQLite3 for development (data in `backend/db.sqlite3`)
- **CORS:** Only `localhost:4200` is allowed (update `settings.py` for production)
- **Migrations:** Always committed to version control
- **Static Files:** Not configured for production deployment
- **Authentication:** Not implemented yet (all endpoints are public)
- **File Uploads:** Not implemented

## Git Workflow

### Branch Strategy
- Main branch: `main`
- Feature branches: `claude/claude-md-miuou1arczd6l9vp-015a24jpGLyLFUUkKHDSX2ZK` (current)
- Always develop on designated feature branch

### Recent Commits
```
901ae20 fix person card component
4d88416 implement pre-commit and refactor code
d789fc4 WIP fix devcontainer setup for pre-commit
3f14036 implement pre-commit prettier hook
35196ca implement pre-commit flake8 and isort hook
```

### Commit Message Guidelines
- Use imperative mood ("add feature" not "added feature")
- Be concise but descriptive
- Reference issue numbers if applicable
- Examples: "fix person card component", "implement pre-commit hooks"

### Before Committing
1. Ensure all pre-commit hooks pass
2. Run tests (backend: `python manage.py test`, frontend: `npm test`)
3. Verify no unintended files are staged
4. Check that migrations are included if models changed

## AI Assistant Best Practices

### When Working on Backend

1. **Always read files before modifying:**
   ```
   Read backend/persons/models.py before suggesting model changes
   ```

2. **Create migrations after model changes:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Follow Django conventions:**
   - Use Django ORM, not raw SQL
   - Set `on_delete` for all ForeignKeys
   - Use `related_name` for reverse relationships
   - Add docstrings to complex methods

4. **Check pre-commit before committing:**
   ```bash
   pre-commit run --all-files
   ```

### When Working on Frontend

1. **Maintain type safety:**
   - Never use `any` type
   - Define interfaces for all data structures
   - Use strict TypeScript compiler options

2. **Follow Angular patterns:**
   - Use dependency injection
   - Prefer Observables over Promises
   - Use `async` pipe in templates
   - Keep components focused (single responsibility)

3. **Match backend interfaces:**
   - Ensure `IPerson` matches Django model serialization
   - Use snake_case for API data (matches Django convention)
   - Transform to camelCase in TypeScript if needed

4. **Test components:**
   - Write unit tests for new components
   - Mock services in tests
   - Test both happy path and error cases

### General Guidelines

1. **Avoid over-engineering:**
   - Only make requested changes
   - Don't add unnecessary abstractions
   - Don't refactor unrelated code
   - Keep solutions simple and focused

2. **Security awareness:**
   - Validate user input at API boundaries
   - Be cautious with CSRF tokens (known issue)
   - Don't commit secrets or credentials
   - Sanitize data before database insertion

3. **Code consistency:**
   - Follow existing patterns in the codebase
   - Match naming conventions
   - Respect file organization structure
   - Use same libraries as existing code

4. **Documentation:**
   - Add docstrings to complex functions
   - Update CLAUDE.md when making architectural changes
   - Keep comments focused on "why" not "what"
   - Don't add comments to obvious code

5. **Error handling:**
   - Handle errors at appropriate boundaries
   - Return meaningful error messages
   - Don't add error handling for impossible cases
   - Trust framework guarantees (Django ORM, Angular)

## File References Format

When referencing code locations, use this format:
```
file_path:line_number
```

Examples:
- Person model definition: `backend/persons/models.py:7`
- CSRF issue: `backend/persons/views.py:712`
- IPerson interface: `frontend/src/app/models/person.interface.ts:5`

## Resources

### Documentation
- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- Angular: https://angular.io/docs
- Angular Material: https://material.angular.io/
- TypeScript: https://www.typescriptlang.org/docs/

### Configuration Files
- Backend settings: `backend/nimloth/settings.py`
- Angular config: `frontend/angular.json`
- TypeScript config: `frontend/tsconfig.json`
- ESLint rules: `frontend/.eslintrc.js`
- Flake8 rules: `setup.cfg`
- Pre-commit: `.pre-commit-config.yaml`
- Docker: `docker-compose.yml`

### Key Commands Reference

| Task | Command |
|------|---------|
| Start dev environment | `docker-compose up` |
| Run backend | `python manage.py runserver` |
| Run frontend | `npm start` (in frontend/) |
| Run all tests | `python manage.py test && npm test` |
| Create migration | `python manage.py makemigrations` |
| Apply migrations | `python manage.py migrate` |
| Install pre-commit | `pre-commit install` |
| Run pre-commit | `pre-commit run --all-files` |
| Generate component | `ng generate component name` |
| Build frontend | `npm run build` |

---

**Last Updated:** 2025-12-06
**Repository:** /home/user/nimloth
**Current Branch:** claude/claude-md-miuou1arczd6l9vp-015a24jpGLyLFUUkKHDSX2ZK
