# Testing Documentation

This document provides comprehensive information about the test suites for the Nimloth project.

## Overview

Nimloth has comprehensive test coverage for both backend and frontend:

- **Backend**: 26 tests (Django/Python)
- **Frontend**: 18 tests (Angular/TypeScript)
- **Total**: 44 tests

All tests are automatically run in CI/CD via GitHub Actions on every push and pull request.

## Table of Contents

- [Running Tests](#running-tests)
  - [Backend Tests](#backend-tests)
  - [Frontend Tests](#frontend-tests)
- [Backend Test Suite](#backend-test-suite)
  - [Model Tests](#model-tests-14-tests)
  - [API Tests](#api-tests-11-tests)
  - [Serializer Tests](#serializer-tests-1-test)
- [Frontend Test Suite](#frontend-test-suite)
  - [Service Tests](#service-tests-10-tests)
  - [Component Tests](#component-tests-8-tests)
- [CI/CD Integration](#cicd-integration)
- [Writing New Tests](#writing-new-tests)
- [Test Best Practices](#test-best-practices)

---

## Running Tests

### Backend Tests

**Location**: `backend/persons/tests.py`

**Run all tests**:
```bash
cd backend
python manage.py test
```

**Run specific test class**:
```bash
python manage.py test persons.tests.PersonModelTestCase
```

**Run specific test**:
```bash
python manage.py test persons.tests.PersonModelTestCase.test_person_full_name_with_all_parts
```

**With verbose output**:
```bash
python manage.py test --verbosity=2
```

### Frontend Tests

**Location**: `frontend/src/app/**/*.spec.ts`

**Run all tests**:
```bash
cd frontend
npm test
```

**Run tests in headless mode (CI)**:
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

**Run tests with coverage**:
```bash
ng test --code-coverage
```

**Run specific test file**:
```bash
ng test --include='**/person.service.spec.ts'
```

---

## Backend Test Suite

### Model Tests (14 tests)

**File**: `backend/persons/tests.py` → `PersonModelTestCase`

These tests validate the `Person` model's fields, methods, and relationships.

#### Name Methods
1. **test_person_full_name_with_all_parts**
   - Tests `full_name()` with first, middle, and last name
   - Expected: "Alice Marie Thompson"

2. **test_person_full_name_without_middle**
   - Tests `full_name()` without middle name
   - Expected: "Bob Smith"

3. **test_person_full_name_single_name**
   - Tests `full_name()` with only first name
   - Expected: "Madonna"

#### Date Calculations
4. **test_person_time_since_birth_returns_dict**
   - Tests `time_since_birth()` returns correct structure
   - Verifies presence of years, months, days keys

5. **test_person_time_since_birth_calculates_correctly**
   - Tests accurate age calculation
   - Uses `relativedelta` for verification

6. **test_person_time_since_birth_none_when_no_dob**
   - Tests `time_since_birth()` returns None when DOB is not set

7. **test_person_time_since_death_returns_dict**
   - Tests `time_since_death()` structure
   - Verifies dictionary with years, months, days

8. **test_person_time_since_death_none_when_alive**
   - Tests `time_since_death()` returns None for living persons

#### Field Validation
9. **test_person_gender_choices**
   - Tests all valid gender choices: M, F, N, U
   - Creates person for each valid option

10. **test_person_optional_fields_can_be_blank**
    - Tests that optional fields can be left empty
    - Verifies middle_name, birth_name, artist_name, dates, parents

#### Relationships
11. **test_person_mother_relationship**
    - Tests mother ForeignKey relationship
    - Verifies bidirectional relationship with `mother_of`

12. **test_person_father_relationship**
    - Tests father ForeignKey relationship
    - Verifies bidirectional relationship with `father_of`

#### Auto Fields
13. **test_person_created_on_auto_set**
    - Tests `created_on` is automatically set to today

14. **test_person_modified_on_auto_updates**
    - Tests `modified_on` updates on save

---

### API Tests (11 tests)

**File**: `backend/persons/tests.py` → `PersonAPITestCase`

These tests validate the REST API endpoints using Django REST Framework's test client.

#### GET Requests
1. **test_get_all_persons**
   - Tests `GET /api/person/`
   - Verifies 200 OK and list response

2. **test_get_person_by_id**
   - Tests `GET /api/person/{id}/`
   - Verifies correct person data returned

3. **test_get_person_not_found**
   - Tests `GET /api/person/9999/`
   - Verifies 404 response and error message

#### POST Requests
4. **test_create_person_valid_data**
   - Tests `POST /api/person/` with complete data
   - Verifies 201 Created and person count

5. **test_create_person_minimal_data**
   - Tests `POST /api/person/` with minimal fields
   - Verifies only required fields needed

6. **test_create_person_with_parent_relationship**
   - Tests creating person with mother and father references
   - Verifies foreign key relationships

#### PUT Requests
7. **test_update_person**
   - Tests `PUT /api/person/{id}/`
   - Verifies data updates and 200 OK

8. **test_update_person_not_found**
   - Tests `PUT /api/person/9999/`
   - Verifies 404 response

#### DELETE Requests
9. **test_delete_person**
   - Tests `DELETE /api/person/{id}/`
   - Verifies 204 No Content and deletion

10. **test_delete_person_not_found**
    - Tests `DELETE /api/person/9999/`
    - Verifies 404 response

---

### Serializer Tests (1 test)

**File**: `backend/persons/tests.py` → `PersonSerializerTestCase`

1. **test_serializer_contains_expected_fields**
   - Validates all 14 fields are present in serialized output
   - Fields: id, names, dates, places, relationships, gender

2. **test_serializer_field_values**
   - Verifies correct serialization of field values
   - Tests data type and value accuracy

---

## Frontend Test Suite

### Service Tests (10 tests)

**File**: `frontend/src/app/person.service.spec.ts`

These tests validate the `PersonService` HTTP operations using Angular's `HttpClientTestingModule`.

#### Basic Service
1. **should be created**
   - Verifies service instantiation

#### GET Operations
2. **getAllPersons: should retrieve all persons from the API**
   - Tests GET request to `/api/person/`
   - Verifies HTTP method and response data

3. **getAllPersons: should return an empty array when no persons exist**
   - Tests empty response handling

#### POST Operations
4. **createPerson: should create a new person via POST request**
   - Tests POST to `/api/person/`
   - Verifies request body and response

5. **createPerson: should emit created person through personCreated$ observable**
   - Tests RxJS Subject emission
   - Verifies Observable pattern

#### PUT Operations
6. **updatePerson: should update an existing person via PUT request**
   - Tests PUT to `/api/person/{id}/`
   - Verifies update data

7. **updatePerson: should emit updated person through personCreated$ observable**
   - Tests Observable emission on update

#### DELETE Operations
8. **deletePerson: should delete a person via DELETE request**
   - Tests DELETE to `/api/person/{id}/`
   - Verifies null response

9. **deletePerson: should emit empty person through personCreated$ observable on delete**
   - Tests Observable emission on delete

#### Error Handling
10. **should handle error when getAllPersons fails**
    - Tests 500 server error handling

11. **should handle error when createPerson fails**
    - Tests 400 bad request handling

---

### Component Tests (8 tests)

All component tests verify basic component creation and dependency injection.

#### AppComponent (2 tests)
**File**: `frontend/src/app/app.component.spec.ts`

1. **should create the app**
   - Verifies root component creation

2. **should have as title 'nimloth'**
   - Verifies title property

#### CreateModalComponent (1 test)
**File**: `frontend/src/app/create-modal/create-modal.component.spec.ts`

1. **should create**
   - Verifies modal component with MatDialogRef

#### EditModalComponent (1 test)
**File**: `frontend/src/app/edit-modal/edit-modal.component.spec.ts`

1. **should create**
   - Verifies modal component with MatDialogRef

#### NavbarComponent (1 test)
**File**: `frontend/src/app/navbar/navbar.component.spec.ts`

1. **should create**
   - Verifies navigation component with AuthService

#### PersonCardComponent (1 test)
**File**: `frontend/src/app/person-card/person-card.component.spec.ts`

1. **should create**
   - Verifies card component with mock person input

#### TreeVisualizationComponent (1 test)
**File**: `frontend/src/app/tree-visualization/tree-visualization.component.spec.ts`

1. **should create**
   - Verifies tree view component

---

## CI/CD Integration

### GitHub Actions Workflows

#### Backend CI (`.github/workflows/django.yml`)

Runs on every push and pull request to all branches.

**Steps**:
1. Setup Python 3.9
2. Install dependencies (requirements.txt + requirements-dev.txt)
3. Run Black formatting check
4. Run Flake8 linting
5. Run isort import check
6. **Run Django tests** (`python manage.py test`)
7. Check for uncommitted migrations

**Expected Result**: All 26 backend tests pass

#### Frontend CI (`.github/workflows/frontend.yml`)

Runs on every push and pull request to all branches.

**Steps**:
1. Setup Node.js 20.x
2. Install dependencies (`npm ci`)
3. Run Prettier formatting check
4. Run ESLint linting
5. **Run Angular tests** (`npm test -- --watch=false --browsers=ChromeHeadless`)
6. Build production bundle

**Expected Result**: All 18 frontend tests pass

---

## Writing New Tests

### Backend Tests

Add new tests to `backend/persons/tests.py`:

```python
from django.test import TestCase
from persons.models import Person

class PersonModelTestCase(TestCase):
    def setUp(self):
        """Create test data"""
        self.person = Person.objects.create(
            first_name="Test",
            gender="U"
        )

    def test_new_feature(self):
        """Test description"""
        # Arrange
        expected = "value"

        # Act
        actual = self.person.some_method()

        # Assert
        self.assertEqual(expected, actual)
```

### Frontend Tests

Create a `.spec.ts` file next to your component/service:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should do something', () => {
    expect(component.someMethod()).toBe(true);
  });
});
```

---

## Test Best Practices

### General
- **One assertion per test**: Each test should verify one specific behavior
- **Descriptive names**: Use clear test names that describe what is being tested
- **AAA pattern**: Arrange, Act, Assert structure
- **Independent tests**: Tests should not depend on each other
- **Clean up**: Use `setUp` and `tearDown` appropriately

### Backend (Django)
- Use `TestCase` for database tests (automatic transaction rollback)
- Use `APIClient` for API endpoint tests
- Mock external services (don't make real API calls)
- Test both success and error cases
- Validate response status codes and data structure

### Frontend (Angular)
- Use `HttpClientTestingModule` for services using HTTP
- Provide mock dependencies for Angular Material components
- Test component creation at minimum
- Use `fixture.detectChanges()` to trigger change detection
- Mock services in component tests

---

## Test Coverage Goals

### Current Coverage
- **Backend**: Core model and API functionality fully tested
- **Frontend**: Service layer and basic component creation tested

### Future Coverage Improvements
1. Add E2E tests for critical user flows
2. Increase component interaction tests
3. Add authentication/authorization tests
4. Add form validation tests
5. Add error boundary tests

---

## Troubleshooting

### Backend Tests Failing

**Problem**: ImportError or ModuleNotFoundError
**Solution**: Ensure all dependencies are installed:
```bash
pip install -r requirements-dev.txt
```

**Problem**: Database errors
**Solution**: Run migrations:
```bash
python manage.py migrate
```

### Frontend Tests Failing

**Problem**: "No provider for..."
**Solution**: Add required provider to TestBed:
```typescript
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [{ provide: SomeService, useValue: mockService }]
});
```

**Problem**: ChromeHeadless not found
**Solution**: Install Chrome or use a different browser in `karma.conf.js`

---

## Resources

- [Django Testing Documentation](https://docs.djangoproject.com/en/4.2/topics/testing/)
- [Django REST Framework Testing](https://www.django-rest-framework.org/api-guide/testing/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)

---

**Last Updated**: 2025-12-07
**Test Count**: 44 (26 backend + 18 frontend)
**Status**: ✅ All tests passing
