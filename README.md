# Rescue of an AI-Generated Web Application
### From a Flawed Prototype to a Secure, Reliable, and Production-Ready SaaS Application

![Project Status](https://img.shields.io/badge/Project-In%20Progress-orange)
![Framework](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Language](https://img.shields.io/badge/TypeScript-Enabled-blue?logo=typescript)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)
![Backend](https://img.shields.io/badge/Backend-Supabase-3FCF8E?logo=supabase)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)

---

## 1. Project Overview

**Rescue of an AI-Generated Web Application** is a software development and security project focused on identifying, fixing, and improving problems in AI-generated web applications.

AI coding tools can generate functional applications quickly. However, applications that work during demonstrations may still contain serious problems related to security, authentication, database management, error handling, performance, and deployment.

This project simulates a real-world situation in which a founder has used an AI coding tool to create a small SaaS application. Although the application initially appears to work, it is not ready for real users.

The goal is to take that application, perform a detailed technical audit, identify its weaknesses, implement the necessary fixes, and transform it into a secure, stable, and production-ready application.

For this project, the selected application is an **Invoice Tracker SaaS**.

The application will allow users to manage their invoices through a web-based dashboard while ensuring that each user's information remains private and protected.

### Main Objective

To demonstrate the ability to take an AI-generated application beyond a basic working prototype by applying real-world software engineering practices, including:

- Full-stack web development.
- Application security and vulnerability assessment.
- Authentication and authorization.
- Database design and access control.
- Error handling and application monitoring.
- Performance optimization.
- Software testing and debugging.
- Cloud deployment and production configuration.
- Technical documentation.

---

## 2. Project Goals

The main goals of this project are:

1. Build or obtain an intentionally flawed AI-generated web application.
2. Identify at least eight issues across different technical areas.
3. Prepare a detailed security and technical audit report.
4. Evaluate each issue based on its impact and severity.
5. Fix security vulnerabilities and application errors.
6. Implement proper authentication and database access controls.
7. Improve application reliability and performance.
8. Deploy the improved application using Vercel.
9. Compare the application before and after the improvements.
10. Document the complete development and rescue process.

The final result should be a functional application that follows better security, reliability, and development practices.

---

## 3. Application Description: Invoice Tracker SaaS

The Invoice Tracker is a web-based application designed to help users create, manage, and track invoices.

Users will be able to register, log in, access their personal dashboards, create invoices, update invoice information, and monitor payment statuses.

The application will also provide a secure environment in which users can access only their own records.

### Core Features

#### User Authentication
- User registration.
- Secure login and logout.
- Session management.
- Protected dashboard pages.
- Authentication validation.
- Password reset functionality, if included in the final scope.

#### Invoice Management
- Create new invoices.
- View invoice details.
- Update existing invoices.
- Delete invoices.
- Assign invoices to customers.
- Track invoice amounts and due dates.
- Manage payment statuses.

#### Dashboard
- Display total invoices.
- Show paid and unpaid invoices.
- Display pending and overdue invoices.
- Provide an overview of invoice activity.
- Allow users to access their invoice records.

#### Search and Filtering
- Search invoices.
- Filter invoices by payment status.
- Organize invoice records.
- Display relevant information efficiently.

#### User Experience
- Responsive interface for desktop and mobile devices.
- Loading indicators.
- Empty-state messages.
- Error messages.
- Success notifications.
- Form validation.

---

## 4. Technology Stack

The project uses modern web development technologies.

| Technology | Purpose |
|---|---|
| Next.js | Application framework and frontend/backend development |
| React | Building reusable user interface components |
| TypeScript | Type safety and improved code reliability |
| Tailwind CSS | Responsive styling and UI design |
| Supabase | Backend services and authentication |
| PostgreSQL | Relational database management |
| Git | Version control |
| GitHub | Source code management and collaboration |
| Vercel | Application hosting and deployment |
| Sentry | Error monitoring and logging |
| Lighthouse | Performance and quality measurement |

### Technology Details

**Next.js**

Used to develop application pages, layouts, server-side functionality, API endpoints, and routing.

**TypeScript**

Used to improve code quality through static type checking and reduce common programming errors.

**Tailwind CSS**

Used to create a responsive and consistent user interface.

**Supabase**

Provides managed PostgreSQL database services, user authentication, and database security features.

**PostgreSQL**

Stores application information, including invoice records and their relationships with authenticated users.

**Vercel**

Hosts the Next.js application and provides production deployment.

**Sentry**

Used to capture and monitor application errors so that issues can be investigated and resolved.

**Lighthouse**

Used to measure performance, accessibility, SEO, and best practices.

---

## 5. System Architecture

The application follows a client-server architecture.

### High-Level Architecture

```text
                 USER
                   |
                   v
             Web Browser
                   |
                   v
       Next.js + React Frontend
                   |
                   v
          Application Logic
                   |
          Authentication Check
                   |
          Request Validation
                   |
                   v
             Supabase
                   |
          +--------+--------+
          |                 |
          v                 v
      Supabase Auth    PostgreSQL
                            |
                            v
                    Row-Level Security
                            |
                            v
                     Protected Data
```

### Architecture Components

**Frontend Layer**

Responsible for displaying the application interface, collecting user input, and presenting invoice information.

**Application Layer**

Handles application logic, validates requests, checks authentication, and performs authorized operations.

**Authentication Layer**

Manages user identities and sessions through Supabase Auth.

**Database Layer**

Stores invoice records and maintains relationships between users and their invoices.

**Security Layer**

Uses PostgreSQL Row-Level Security policies to restrict access to individual users' records.

**Deployment Layer**

Uses Vercel to host the application and manage production deployment.

---

## 6. Phase 1: Build or Obtain the Flawed Application

The first phase involves creating or obtaining an AI-generated prototype that contains intentionally introduced problems.

The initial application will provide basic invoice management functionality but will contain weaknesses that need to be identified and corrected.

At least eight issues will be introduced or identified across the following categories:

| Category | Example Issue |
|---|---|
| Authentication | Missing or incomplete authentication checks |
| Security | Insecure handling of API keys or secrets |
| Database Structure | Incorrect relationships or missing constraints |
| Integrations | Missing handling for failed external requests |
| Error Handling | Missing or unclear error messages |
| Inconsistent Behavior | Duplicate form submissions or unreliable database writes |
| Deployment | Incorrect environment configuration |
| Performance | Unnecessary requests and inefficient rendering |

The initial prototype will be kept separate from the final production version.

**Important:** Intentionally introduced security weaknesses will only be used in a controlled development environment with test data and dummy credentials. Vulnerable versions will not be exposed publicly.

---

## 7. Phase 2: Technical Audit and Vulnerability Assessment

After obtaining the initial application, a technical audit will be performed.

The purpose of the audit is to understand how the application works, identify its weaknesses, evaluate the risks, and prepare a plan for fixing them.

### Audit Report Structure

Each identified issue will include:

- Issue ID.
- Category.
- Description of the problem.
- Why the issue matters.
- Potential impact.
- Severity level.
- Proposed solution.
- Estimated fixing time.
- Current status.

### Severity Classification

| Severity | Description |
|---|---|
| Critical | A serious vulnerability or failure that could cause major damage or unauthorized access |
| High | A significant security or reliability problem |
| Medium | A problem that affects functionality, performance, or maintainability |
| Low | A minor issue with limited impact |

### Example Audit Finding

**Issue ID:** A-01

**Category:** Security

**Issue:** An API secret is included in client-side application code.

**Risk:** Visitors may be able to inspect the application and obtain the exposed credential.

**Severity:** Critical or High, depending on the credential's permissions and exposure.

**Proposed Solution:**
- Move private credentials to environment variables.
- Access secrets only through trusted server-side code.
- Rotate any genuinely exposed credentials.
- Check that private keys are not included in the frontend build.

**Estimated Effort:** Depends on the affected functionality.

The audit report will contain all identified issues and their corresponding solutions.

---

## 8. Phase 3: Application Rescue and Security Improvements

This phase focuses on fixing the identified problems and improving the overall application.

### 8.1 Secret and Environment Variable Management

Private credentials must not be stored directly in source code or exposed through frontend files.

Improvements will include:

- Moving private credentials into environment variables.
- Separating development and production configuration.
- Adding `.env.local` to `.gitignore`.
- Creating a safe `.env.example` file.
- Keeping private keys on the server.
- Rotating exposed credentials where necessary.

### 8.2 Authentication and Authorization

The application will use Supabase Authentication to manage user accounts and sessions.

Improvements will include:

- User registration.
- Secure login and logout.
- Session validation.
- Protected application routes.
- Server-side authentication checks.
- Authorization checks before sensitive operations.

Authentication identifies the user, while authorization determines what that user is allowed to access.

Both are necessary for protecting application data.

### 8.3 Row-Level Security (RLS)

PostgreSQL Row-Level Security will be implemented to protect user records.

Each invoice will be associated with its owner through a user ID.

Database policies will ensure that users can access and modify only the records they are authorized to manage.

Example ownership condition:

```sql
auth.uid() = user_id
```

Appropriate policies will be created for:

- SELECT: Reading records.
- INSERT: Creating records.
- UPDATE: Updating records.
- DELETE: Deleting records.

The policies will be tested using separate user accounts to verify that unauthorized access is blocked.

### 8.4 Database Design and Relationships

The database will be reviewed and improved to maintain data consistency.

The invoice database may include:

| Field | Description |
|---|---|
| id | Unique invoice identifier |
| user_id | ID of the invoice owner |
| customer_name | Customer's name |
| invoice_number | Invoice reference number |
| amount | Invoice amount |
| status | Payment status |
| issue_date | Invoice creation date |
| due_date | Payment due date |
| created_at | Record creation timestamp |
| updated_at | Last update timestamp |

Database improvements will include:

- Primary keys.
- Foreign key relationships.
- Appropriate data types.
- Required fields.
- Validation constraints.
- Database indexes where useful.
- Consistent status values.
- Database migrations.

### 8.5 Error Handling and Monitoring

The application will be improved to handle unexpected errors properly.

Improvements will include:

- Handling failed database requests.
- Displaying understandable error messages.
- Avoiding silent failures.
- Adding appropriate logging.
- Integrating Sentry for error monitoring.
- Testing error reporting.

Sensitive information, passwords, tokens, and private credentials must never be included in error logs.

### 8.6 Loading, Empty, Error, and Success States

The application will provide appropriate feedback during different operations.

**Loading State:** Displays a loading indicator while information is being retrieved.

**Empty State:** Displays a helpful message when no invoices exist.

**Error State:** Explains when an operation fails and provides a retry option where appropriate.

**Success State:** Confirms when an invoice is successfully created, updated, or deleted.

### 8.7 Performance Optimization

Application performance will be measured and improved using Lighthouse.

Possible improvements include:

- Reducing unnecessary JavaScript.
- Optimizing images and fonts.
- Reducing unnecessary database requests.
- Improving component rendering.
- Removing unused dependencies.
- Optimizing data fetching.
- Improving page loading behavior.

**Performance Target:** Achieve a Lighthouse Performance score of 90 or higher under documented testing conditions.

Other Lighthouse categories will also be measured and improved where possible.

### 8.8 Deployment Improvements

The application will be deployed using Vercel.

Deployment improvements will include:

- Connecting the GitHub repository.
- Configuring production environment variables.
- Resolving build errors.
- Applying database migrations.
- Verifying database connectivity.
- Testing production authentication.
- Checking application routes.
- Testing the deployed application.

The final deployment will be tested to ensure that the main features work correctly in the production environment.

---

## 9. Phase 4: Testing and Quality Assurance

Testing is an important part of the rescue process.

The application must be tested after implementing the fixes to verify that it works correctly and that the original problems have been resolved.

### Testing Areas

**Authentication Testing**
- Register a new user.
- Log in with valid credentials.
- Reject invalid login attempts.
- Verify protected routes.
- Test logout and session handling.

**Database Testing**
- Create an invoice.
- Read invoice records.
- Update an invoice.
- Delete an invoice.
- Verify data consistency.

**Security Testing**
- Verify that private credentials are not exposed.
- Test access restrictions.
- Verify RLS policies.
- Test access using multiple user accounts.
- Check security-related HTTP headers.

**Error Handling Testing**
- Test failed database requests.
- Test invalid form submissions.
- Verify that useful error messages appear.
- Verify that application errors are recorded in Sentry.

**Performance Testing**
- Run Lighthouse tests.
- Review performance reports.
- Identify unnecessary resource loading.
- Compare initial and final measurements.

**Responsive Testing**
- Test desktop layouts.
- Test tablet layouts.
- Test mobile layouts.

### Testing Tools

- Browser Developer Tools.
- Lighthouse.
- Sentry.
- Git.
- GitHub.
- Supabase Dashboard.
- Automated tests where appropriate.

---

## 10. Phase 5: Deployment and Production Readiness

After development and testing, the improved application will be deployed to Vercel.

### Deployment Process

1. Finalize the application code.
2. Commit and push changes to GitHub.
3. Connect the repository to Vercel.
4. Configure production environment variables.
5. Verify Supabase configuration.
6. Apply database migrations and security policies.
7. Run the production build.
8. Deploy the application.
9. Test the live application.
10. Verify authentication, database access, and application functionality.

### Production Readiness Checklist

- No exposed private credentials.
- Authentication works correctly.
- Authorization is properly enforced.
- RLS policies are active and tested.
- Database relationships are correct.
- Errors are handled and monitored.
- Application pages are responsive.
- Performance has been measured.
- Production deployment is working.
- Documentation is complete.

---

## 11. Before-and-After Comparison

A major part of this project is demonstrating measurable improvements.

The initial application and the rescued application will be compared using code changes, testing results, and performance measurements.

| Area | Initial Application | Improved Application |
|---|---|---|
| Authentication | Identified weaknesses | Validated authentication and sessions |
| Security | Identified secret-handling risks | Secure environment configuration |
| Database | Identified schema and access issues | Improved relationships and RLS |
| Error Handling | Missing or inconsistent handling | Structured error handling |
| Monitoring | Limited visibility into errors | Sentry integration |
| Performance | Baseline measurement | Optimized application |
| User Experience | Missing interface states | Loading, empty, error and success states |
| Deployment | Identified configuration issues | Verified Vercel deployment |

### Metrics to Record

| Metric | Initial Result | Final Result |
|---|---|---|
| Lighthouse Performance | To be measured | Target: 90+ |
| Lighthouse Accessibility | To be measured | Record actual result |
| Lighthouse Best Practices | To be measured | Record actual result |
| Lighthouse SEO | To be measured | Record actual result |
| Security Headers | To be inspected | Record verified result |
| Authentication Tests | To be tested | Record pass/fail |
| Cross-User Access Tests | To be tested | Record pass/fail |
| Error Monitoring | To be tested | Verify Sentry events |

All results will be recorded from actual tests. No performance or security improvements will be claimed without evidence.

---

## 12. Project Development Timeline

The project is planned as a three-week development and improvement sprint.

### Week 1: Build and Audit

- Select the application use case.
- Set up the development environment.
- Build or obtain the flawed application.
- Identify at least eight issues.
- Perform the technical audit.
- Prepare the audit report.
- Record initial performance and security measurements.

**Expected Outcome:** Initial application and completed audit report.

### Week 2: Rescue and Deployment

- Fix secret management.
- Improve authentication and authorization.
- Implement RLS.
- Improve database structure.
- Fix application errors.
- Integrate error monitoring.
- Improve application performance.
- Deploy the improved application to Vercel.

**Expected Outcome:** Repaired and deployed application with critical and high-severity fixes verified.

### Week 3: Testing and Documentation

- Perform security testing.
- Test database access controls.
- Perform functional and responsive testing.
- Measure final Lighthouse scores.
- Compare initial and final results.
- Prepare code diffs.
- Write the one-page case study.
- Record the Loom walkthrough.
- Finalize project documentation.

**Expected Outcome:** Complete project with all required deliverables.

---

## 13. Final Project Deliverables

The project will include the following six deliverables:

### 1. Live Application

A publicly accessible deployment hosted on Vercel.

**Live URL:** [Add deployed application URL]

### 2. Technical Audit Report

A detailed PDF or Notion document containing:

- Identified problems.
- Security and technical risks.
- Severity classifications.
- Recommended fixes.
- Estimated effort.
- Final resolution status.

### 3. Before-and-After Code Diffs

Documentation of important code changes, including:

- Secret management.
- Authentication improvements.
- Database access policies.
- Error handling.
- Performance improvements.

### 4. Before-and-After Metrics

A comparison of:

- Lighthouse scores.
- Security headers.
- Authentication and authorization tests.
- Database access tests.
- Error monitoring results.

### 5. One-Page Case Study

A plain-English summary covering:

- Original application problems.
- Technical approach.
- Important improvements.
- Final results.
- Lessons learned.

### 6. Loom Video Demonstration

A 3–5 minute screen recording explaining:

- The application and its purpose.
- The original problems.
- Important security and technical fixes.
- The final deployed application.
- Before-and-after results.

---

## 14. Repository Structure

The final repository will follow a clean and maintainable structure. The exact folders may change depending on the implementation.

```text
Rescue-of-an-AI-Generated-Web-App/
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   └── invoices/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── types/
│   │
│   └── services/
│
├── supabase/
│   └── migrations/
│
├── tests/
│
├── docs/
│   ├── audit-report.md
│   ├── testing-report.md
│   ├── before-after-metrics.md
│   └── case-study.md
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── README.md
└── ...
```

This is a proposed structure, not a claim that every file has already been created.

---

## 15. Installation and Local Setup

Follow these steps to run the application locally once its development is complete.

### Prerequisites

Install the following:

- Node.js (LTS version).
- npm.
- Git.
- A GitHub account.
- A Supabase account.

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Rescue-of-an-AI-Generated-Web-App.git
```

### Step 2: Navigate to the Project

```bash
cd Rescue-of-an-AI-Generated-Web-App
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_supabase_key

SUPABASE_SERVICE_ROLE_KEY=your_private_service_role_key

SENTRY_DSN=your_sentry_dsn
```

Only include variables actually required by the implementation.

**Security Note:**

Never commit `.env.local` or real private credentials to GitHub.

The service-role key must only be used in trusted server-side code when genuinely required. It must never be exposed to the browser. Use the publishable key and user session for normal client operations, protected by RLS.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Step 6: Create a Production Build

```bash
npm run build
```

### Step 7: Run the Production Server Locally

```bash
npm run start
```

---

## 16. Security Principles

Security will be considered throughout the development process rather than added only at the end.

The project will follow these principles:

- Never expose private API keys or credentials.
- Validate user input on the server.
- Verify authentication before accessing protected resources.
- Enforce authorization for every sensitive operation.
- Use database-level access controls.
- Protect user-specific records through RLS.
- Avoid trusting user-supplied IDs for ownership.
- Handle errors without exposing internal details.
- Keep dependencies updated.
- Use HTTPS in production.
- Avoid logging sensitive information.
- Test access restrictions using multiple accounts.

The objective is to build an application where security is part of the system design.

---

## 17. Expected Learning Outcomes

This project is designed to provide practical experience in several areas of software engineering.

### Full-Stack Development
- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- API development.
- Server-side programming.

### Database Development
- PostgreSQL.
- SQL.
- Supabase.
- Relational database design.
- Database migrations.
- Row-Level Security.

### Application Security
- Authentication.
- Authorization.
- Session management.
- Secret management.
- Access control.
- Security auditing.

### Software Engineering
- Code debugging.
- Error handling.
- Software testing.
- Performance optimization.
- Code maintenance.
- Technical documentation.

### Deployment and Monitoring
- Git and GitHub.
- Vercel.
- Production configuration.
- Sentry.
- Lighthouse.
- Application monitoring.

---

## 18. Project Success Criteria

The project will be considered complete when:

- The application supports its main invoice management features.
- At least eight original issues have been documented.
- Critical and high-severity issues have been fixed or explicitly documented as unresolved blockers.
- User authentication works correctly.
- Database access is protected by tested authorization rules.
- Private credentials are not exposed.
- Error monitoring is active and verified.
- Loading, empty, error, and success states are implemented.
- Lighthouse Performance reaches the 90+ target under documented conditions.
- The application is successfully deployed to Vercel.
- Production workflows have been tested.
- All six final deliverables are prepared.

---

## 19. Future Improvements

After completing the core project, possible improvements include:

- PDF invoice generation.
- Email invoice notifications.
- Customer management.
- Invoice export functionality.
- Advanced filtering and search.
- Role-based access control.
- Automated testing.
- CI/CD improvements.
- More detailed application analytics.
- Additional security monitoring.

These features are optional and will only be considered after the core security and reliability requirements are met.

---

## 20. Conclusion

The purpose of this project is not simply to build another web application.

It is to demonstrate the ability to evaluate AI-generated code, identify technical and security weaknesses, and improve an application using practical software engineering principles.

By combining full-stack development, database security, authentication, testing, monitoring, performance optimization, and cloud deployment, this project aims to demonstrate a complete development workflow—from an initial flawed prototype to a more secure and reliable application.

It also highlights an important lesson in modern software development:

**AI can help generate code, but building reliable software requires developers to understand, review, test, secure, and maintain that code.**

---

## Project Information

| Field | Details |
|---|---|
| Project Name | Rescue of an AI-Generated Web Application |
| Application | Invoice Tracker SaaS |
| Project Type | Full-Stack Development and Application Security |
| Duration | 2–3 Weeks |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Next.js Server-Side Logic, Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | RLS, Access Control, Secret Management |
| Monitoring | Sentry |
| Performance Testing | Lighthouse |
| Version Control | Git and GitHub |
| Deployment | Vercel |
| Status | In Progress |

**Developer:** Nisha Ali

**GitHub Repository:** [Add Repository URL]

**Live Application:** [Add Deployment URL]

**Project Documentation:** [Add Audit Report URL]

**Demonstration:** [Add Loom Video URL]