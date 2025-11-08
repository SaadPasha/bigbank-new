# Bigbank – Test task (API & E2E Smoke tests)

This repo contains the Automated test suite for the Loan Calculator application provided by the Bigbank.
This is a web based application which is currently hosted [here](https://taotlus.bigbank.ee/?amount=5000&period=60&productName=SMALL_LOAN&loanPurpose=DAILY_SETTLEMENTS).
The application basically provides the services for the user to add their desired loan amount for a certain period,
and displays the required installment amount to be repaid every month.

The Loan Calculator app heavily relies on the API endpoint - which can be accessed: https://taotlus.bigbank.ee/api/v1/loan/calculate.
The API endpoint is implemented using the REST architecture, and supports the POST method.

This repo will add the Automated test cases (SMOKE level) - identified as the critical severity tests. Passing of these test can be 
considered as a baseline for any changes to be introduced to the application. Full list of test scenarios and additional details can be found [here](https://docs.google.com/document/d/1WmMrHYtfqGN56xVeNKIP_xZo2pEAcWdTeIZfw-311jg/edit?usp=sharing)

The tests in these repo are based on the following scenarios:

### End-to-End
**Loan Calculation with Input variation:**
Open Calculator Modal with default values (Amount 5,000 - Period 60 months), update the values, loan calculation is executed, result displayed and clicking on Jatka closes modal with saving the new values. 
- Input variation:
  - Slider input - closing with click on Jätka. 
  - Numeric input - closing with click on Jätka. 
  - Reopening the Modal restores the Updated values.

### API
**Contract tests**
- Schema Validation
  - Generic Schema validations (req/resp)
    - Field Names correctness
    - Data Types correctness
    - Optional/Required fields
  - Error Schema validations


## Test Architecture
The ideal approach of test architecture in this case is a '_Layered_' test architecture - at least according to my understanding.
The fundamental idea behind this approach is to segregate the different layers of data models, helper/utility classes, loggers, configurators etc,
to reduce coupling, following DRY principle, and improve scalability with less test maintenance in the future, albeit at the same time. The end result is highly
scalable solution, easier to understand and improve with the robustness and minimum flakiness.

### Design Patterns
Besides the Architecture, every project requires a design pattern to follow as well. Here, we've implemented (sort of)
two design patterns (not fully by the book but with some twists!):</br>

**Page Object Model**: 
Playwright officially encourages to develop e2e test using this, so even though there's a lot of dislike, for ths design pattern,
when it comes to your Web based tests, this is the cleanest solution. All web elements, and page functions can be respectively organized
according to their respective URIs. Here in our case, it's implemented as recommended by Playwright, with segregated pages and fixtures. </br>

**Factory Data**:
This is a blend of the classic Factory Model, which basically provides an interface for creating objects, but doesn't restricts its usage. In our API testing case here,
I've blended it with the Data generator functions, to create fake random data everytime, while also allowing the developer to modify the data within the same structure.
This enables a varied number of tests to be carried out, with minimal code required, achieving efficient results.
In conjunction to this pattern, I've added the usage of Fixtures here as well, to keeping uniformity across the repo and, it does elevate the overall DX.

## Tools
The project is developed fully using _Typescript_, and different _Node.js_ packages, with _YAML_ being used for the CI file(s).
The tool set is as follows:
- Test Framework & Runner: Playwright
- API schemas: AJV library
- Reporting: Allure Reports & Playwright Reports
- CI/CD: GitHub Actions
- Report hosting: GitHub pages
- Fake Data: FakerJS

## Running 
Before explaining how to run, you can quickly view the existing test report [here](https://saadpasha.github.io/bigbank-new/) on GitHub pages. Now, to run the repo:
- Clone the repo
- Install deps with: ```npm ci```
- Ensure Playwright engines are installed: ```npx playwright install```
- Run all tests ```npx playwright test --show-report```

=> Side Node: If you would want to test the CI, please send me your github name over email: saadtahir96@outlook.com - and I can add you as a collaborator.
Also, feel free to fork and run! :D 

### Project Structure
```
├── tests
│   ├── api                          -> API-focused test suite (schema tests)
│   │   ├── apiFixtures.ts           -> Defines reusable Playwright fixtures for API tests (baseURL, request context, utility classes, validation models)
│   │   ├── calculate.schema.ts      -> AJV/JSON Schema describing request & response models for the /calculate endpoint
│   │   ├── calculateClient.ts       -> API client wrapper around Playwright’s request context for /calculate operations
│   │   ├── calculateData.factory.ts -> Factory to generate valid (and optionally invalid) payloads using Faker or static test data
│   │   └── schema-validation-tests
│   │       └── schema-tests.spec.ts -> Tests validating that API responses conform to defined AJV schemas for valid/invalid req/resp
│   │
│   ├── e2e                          -> End-to-end tests using browser context (UI + API interaction)
│   │   ├── e2e-fixtures             
│   │   │   └── e2eFixtures.ts       -> Defines E2E fixtures
│   │   ├── pages                    
│   │   │   ├── calculatorModal.page.ts -> POM class for calculator Modal UI components and functions 
│   │   │   └── header.page.ts       -> POM class for header page
│   │   └── test-scripts             
│   │       └── calculateLoan.spec.ts # Full flow test verifying loan calculation via web app
│   │
│   └── example.spec.ts              # Simple demo test file (Playwright default) to validate setup
│
└── tsconfig.json                    # TypeScript configuration (paths, compiler options, module resolution)
```

## Project flow
A visual representation of the Project flow is as follows:
```
┌──────────────────────────────┐
│ Fixtures                     │
│ (apiFixtures.ts)             │
│ (e2eFixtures.ts)             │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ Clients                      │ 
│ (calculateClient.ts)         │
| POM                          |
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ Schemas & Data               │
│ (calculate.schema.ts)        │
│ (calculateData.factory.ts)   │  -> API tests specific 
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ Test Specs                   │
│ (schema-tests.spec.ts)       │
│ (calculateLoan.spec.ts)      │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ Reports & CI                 │
│ (Playwright HTML, Actions)   │
└──────────────────────────────┘

```

Like any project, there's always room for improvement, and in this case as well.
- Containerization
- Reporting enhancements
- Data Injectors
- Logging
- Auto Documentation


Lastly, in case of any queries, please feel free to mail: saadtahir96@outlook.com
