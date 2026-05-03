# Requirements Document

## Introduction

Food Delivery Query Lab is a full-stack web application built as a college PostgreSQL mini-project. It provides an immersive, cinematic "delivery control room" interface for exploring a food delivery database. The application allows students and faculty to interactively run SQL queries, browse entity data, observe PL/pgSQL functions, simulate database triggers, and present findings in a guided presentation mode. The UI is dark-themed with glassmorphism panels, neon green/purple accents, and smooth Framer Motion animations — designed to be visually impressive for academic evaluation.

## Glossary

- **App**: The Food Delivery Query Lab full-stack web application
- **Frontend**: The React + Tailwind CSS + Framer Motion client application
- **Backend**: The Node.js + Express API server
- **Database**: The PostgreSQL database containing food delivery data
- **Query_Lab**: The interactive page where users run predefined SQL queries
- **Entity_Browser**: The page that displays tabular data for each database entity
- **Dashboard**: The page displaying KPI metrics and animated charts
- **Trigger_Demo**: The page simulating PostgreSQL trigger behavior on payment records
- **Functions_Page**: The page displaying PL/pgSQL function outputs interactively
- **Presentation_Mode**: The fullscreen guided walkthrough mode for viva/demo evaluation
- **Landing_Page**: The animated hero entry page of the application
- **Query_Card**: A UI component representing a single SQL query with metadata and expandable SQL preview
- **KPI_Card**: A UI component displaying a key performance indicator with an animated counter
- **Result_Table**: A UI component that renders query results in a paginated, animated table
- **Mock_Data**: Static fallback data served when the Backend or Database is unavailable
- **Entity**: One of the eight database tables — Customer, Restaurant, Orders, Menu_Item, Delivery_Partner, Delivers, Payment, Ratings
- **Syntax_Highlighter**: A UI component that renders SQL with color-coded tokens
- **Insight_Summary**: A plain-English explanation of query results shown after execution
- **Relationship_Strip**: A UI component listing the database tables involved in a query
- **Neon_Accent**: The primary highlight colors — green (#00ff88) and purple (#a855f7)
- **Glassmorphism_Panel**: A semi-transparent frosted-glass card style used throughout the UI

## Requirements

---

### Requirement 1: Application Shell and Navigation

**User Story:** As a user, I want a persistent navigation shell with smooth routing, so that I can move between all pages of the application without full page reloads.

#### Acceptance Criteria

1. THE App SHALL render a persistent top navigation bar containing links to Landing, Dashboard, Query Lab, Entity Browser, Functions, Trigger Demo, and Presentation Mode pages.
2. THE App SHALL use client-side routing so that navigating between pages does not trigger a full browser reload.
3. WHEN a user navigates to an unrecognized route, THE App SHALL redirect the user to the Landing Page.
4. THE App SHALL apply the dark premium theme globally, using a deep space-like background color (approximately #0a0a0f) and Neon_Accent colors for interactive highlights.
5. THE App SHALL display floating animated background elements (e.g., particles or geometric shapes) on every page to reinforce the cinematic aesthetic.
6. WHEN the viewport width is below 768px, THE App SHALL collapse the navigation bar into a hamburger menu.

---

### Requirement 2: Landing Page

**User Story:** As a user, I want an animated hero landing page, so that I immediately understand the purpose of the application and feel engaged by its visual design.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a hero section with the application title "Food Delivery Query Lab" and a subtitle describing its purpose.
2. THE Landing_Page SHALL animate the hero title and subtitle into view using staggered entrance animations on initial load.
3. THE Landing_Page SHALL display one floating Entity card for each of the eight Entities, each showing the entity name and an icon.
4. WHEN a user hovers over an Entity card, THE Landing_Page SHALL apply a tilt/parallax effect to that card.
5. THE Landing_Page SHALL display an isometric city map visual as a decorative section element.
6. THE Landing_Page SHALL include a call-to-action button that navigates the user to the Dashboard page.
7. WHEN the Landing_Page first renders, THE Landing_Page SHALL stagger the entrance of Entity cards with a delay between each card.

---

### Requirement 3: Dashboard — KPI Cards

**User Story:** As a user, I want to see key performance indicators for the food delivery dataset, so that I can quickly understand the scale and health of the data.

#### Acceptance Criteria

1. THE Dashboard SHALL display at minimum three KPI_Cards: "Active Orders", "Avg Delivery Time", and "New Restaurants".
2. WHEN a KPI_Card enters the viewport, THE Dashboard SHALL animate the numeric value from zero to its final value using a counter animation lasting no more than 2000ms.
3. THE Dashboard SHALL fetch KPI values from the Backend at the route `GET /api/dashboard/kpis`.
4. IF the Backend is unavailable, THEN THE Dashboard SHALL display KPI values sourced from Mock_Data without showing an error to the user.
5. EACH KPI_Card SHALL display a label, a numeric value, and a unit or descriptor (e.g., "mins", "restaurants").
6. WHEN KPI data is loading, THE Dashboard SHALL display a skeleton placeholder in place of each KPI_Card.

---

### Requirement 4: Dashboard — Charts

**User Story:** As a user, I want to see animated charts visualizing delivery and order trends, so that I can identify patterns in the food delivery data.

#### Acceptance Criteria

1. THE Dashboard SHALL display a line chart showing order volume over time using the Recharts library.
2. THE Dashboard SHALL display a bar chart showing orders grouped by restaurant or category using the Recharts library.
3. WHEN chart data enters the viewport, THE Dashboard SHALL animate chart elements (lines, bars) into their final positions.
4. THE Dashboard SHALL fetch chart data from the Backend at the route `GET /api/dashboard/charts`.
5. IF the Backend is unavailable, THEN THE Dashboard SHALL render charts using Mock_Data.
6. THE Dashboard SHALL display sparkline indicators on KPI_Cards where applicable.
7. ALL chart components SHALL use the dark theme color palette with Neon_Accent colors for data series.

---

### Requirement 5: Query Lab — Query Cards

**User Story:** As a user, I want to browse a catalog of SQL queries displayed as interactive cards, so that I can discover and understand the queries available in the system.

#### Acceptance Criteria

1. THE Query_Lab SHALL display all available queries as Query_Cards in a grid or list layout.
2. EACH Query_Card SHALL display: a title, a category badge (one of: Simple, Complex, Function, Trigger), a difficulty badge (one of: Easy, Medium, Hard), and a purpose description.
3. THE Query_Lab SHALL support filtering Query_Cards by category.
4. THE Query_Lab SHALL support filtering Query_Cards by difficulty.
5. WHEN the Query_Lab page loads, THE Query_Lab SHALL animate Query_Cards into view with a staggered entrance.
6. THE Query_Lab SHALL contain at minimum 10 predefined queries covering Simple, Complex, Function, and Trigger categories.
7. WHEN a user hovers over a Query_Card, THE Query_Lab SHALL apply a highlight or glow effect using Neon_Accent colors.

---

### Requirement 6: Query Lab — Query Execution

**User Story:** As a user, I want to expand a query card, preview the SQL, and run the query against the database, so that I can see live results and understand what the query does.

#### Acceptance Criteria

1. WHEN a user clicks a Query_Card, THE Query_Lab SHALL expand that card to reveal the SQL using a Syntax_Highlighter component.
2. THE Syntax_Highlighter SHALL color-code SQL keywords, table names, string literals, and numeric literals distinctly.
3. THE expanded Query_Card SHALL display a "RUN QUERY" button.
4. WHEN a user clicks "RUN QUERY", THE Query_Lab SHALL send a request to the Backend at `POST /api/queries/run` with the query identifier.
5. WHEN query results are returned, THE Query_Lab SHALL animate the Result_Table into view.
6. THE Result_Table SHALL display column headers and rows from the query result set.
7. WHEN a result set contains more than 50 rows, THE Result_Table SHALL paginate results showing 50 rows per page.
8. WHEN a query is executing, THE Query_Lab SHALL display a loading indicator on the "RUN QUERY" button.
9. IF the query execution fails, THEN THE Query_Lab SHALL display an error message within the expanded card without collapsing it.
10. IF the Backend is unavailable, THEN THE Query_Lab SHALL execute the query against Mock_Data and display results with a "Demo Mode" indicator.

---

### Requirement 7: Query Lab — Insight and Explanation Panel

**User Story:** As a user, I want to see a plain-English explanation and insight summary for each query, so that I can understand what the query does and what the results mean.

#### Acceptance Criteria

1. WHEN a query has been executed, THE Query_Lab SHALL display an Insight_Summary below the Result_Table describing what the results reveal.
2. THE Query_Lab SHALL display a side explanation panel that describes the query in plain English, including its purpose and the logic it applies.
3. THE side explanation panel SHALL be visible when a Query_Card is expanded, regardless of whether the query has been run.
4. THE Query_Lab SHALL display a Relationship_Strip listing all Entity names involved in the expanded query.
5. EACH entity name in the Relationship_Strip SHALL be visually distinct (e.g., colored chip/badge).

---

### Requirement 8: Entity Browser

**User Story:** As a user, I want to browse the raw data for each database entity in a table view, so that I can inspect the underlying records.

#### Acceptance Criteria

1. THE Entity_Browser SHALL display a selector (tabs or dropdown) listing all eight Entities.
2. WHEN a user selects an Entity, THE Entity_Browser SHALL fetch and display that entity's records from the Backend at `GET /api/entities/:entityName`.
3. THE Entity_Browser SHALL render records in a table with one column per database field.
4. THE Entity_Browser SHALL support a text search input that filters displayed rows by any visible field value.
5. WHEN the Entity_Browser fetches data, THE Entity_Browser SHALL display a loading skeleton in place of the table.
6. IF the Backend is unavailable, THEN THE Entity_Browser SHALL display Mock_Data for the selected Entity.
7. THE Entity_Browser SHALL display the total record count for the currently selected Entity.
8. WHEN a user types in the search input, THE Entity_Browser SHALL filter results within 300ms of the last keystroke.

---

### Requirement 9: Functions Page

**User Story:** As a user, I want to invoke PL/pgSQL functions and see their outputs displayed interactively, so that I can demonstrate database function capabilities.

#### Acceptance Criteria

1. THE Functions_Page SHALL list all available PL/pgSQL functions with a name, description, and parameter inputs.
2. WHEN a user provides parameter values and submits a function, THE Functions_Page SHALL call the Backend at `POST /api/functions/run` with the function name and parameters.
3. THE Functions_Page SHALL display the function's return value or result set in a formatted output panel.
4. WHEN a function call is in progress, THE Functions_Page SHALL display a loading indicator.
5. IF a function call returns an error, THEN THE Functions_Page SHALL display the error message in the output panel.
6. THE Functions_Page SHALL include at minimum 3 PL/pgSQL functions relevant to the food delivery domain (e.g., calculate average delivery time for a restaurant, get top customers by order count, compute revenue by restaurant).
7. IF the Backend is unavailable, THEN THE Functions_Page SHALL display Mock_Data outputs for each function.

---

### Requirement 10: Trigger Demo

**User Story:** As a user, I want to simulate a payment event and observe how a PostgreSQL trigger automatically changes the payment status, so that I can demonstrate trigger behavior during evaluation.

#### Acceptance Criteria

1. THE Trigger_Demo SHALL display a form allowing the user to enter payment details (e.g., order ID, amount, initial status).
2. THE Trigger_Demo SHALL display a "BEFORE" state panel showing the payment record values prior to submission.
3. WHEN a user submits the form, THE Trigger_Demo SHALL send the payment data to the Backend at `POST /api/triggers/payment`.
4. WHEN the Backend responds, THE Trigger_Demo SHALL display an "AFTER" state panel showing the updated payment record values.
5. THE Trigger_Demo SHALL visually highlight fields that were automatically changed by the trigger (e.g., status field highlighted with Neon_Accent color).
6. THE Trigger_Demo SHALL display a trigger status indicator showing whether the trigger fired successfully.
7. WHEN transitioning from BEFORE to AFTER state, THE Trigger_Demo SHALL animate the state change using a smooth transition.
8. IF the Backend is unavailable, THEN THE Trigger_Demo SHALL simulate the trigger behavior using client-side Mock_Data logic and display a "Simulated" indicator.

---

### Requirement 11: Presentation Mode

**User Story:** As a user, I want a fullscreen guided presentation mode, so that I can walk faculty through the application during a viva or mini-project evaluation with minimal friction.

#### Acceptance Criteria

1. THE Presentation_Mode SHALL render in fullscreen, hiding the standard navigation bar.
2. THE Presentation_Mode SHALL display content with larger typography (minimum 1.25× the standard font size).
3. THE Presentation_Mode SHALL define a guided sequence of slides or sections covering: Landing overview, Dashboard KPIs, Query Lab demo, Entity Browser, Functions, and Trigger Demo.
4. WHEN a user clicks "Next", THE Presentation_Mode SHALL advance to the next section in the guided sequence with an animated transition.
5. WHEN a user clicks "Previous", THE Presentation_Mode SHALL return to the previous section with an animated transition.
6. THE Presentation_Mode SHALL display a progress indicator showing the current step and total steps.
7. WHEN a user presses the Escape key, THE Presentation_Mode SHALL exit fullscreen and return to the standard application view.
8. THE Presentation_Mode SHALL be accessible from a dedicated route and from a button in the navigation bar.

---

### Requirement 12: Backend API

**User Story:** As a developer, I want a structured Express backend with clear routes and controllers, so that the frontend can reliably fetch data and execute queries.

#### Acceptance Criteria

1. THE Backend SHALL expose RESTful API routes under the `/api` prefix.
2. THE Backend SHALL connect to the Database using the `pg` library with connection parameters sourced from environment variables.
3. THE Backend SHALL implement the following route groups: `/api/dashboard`, `/api/queries`, `/api/entities`, `/api/functions`, `/api/triggers`.
4. WHEN a Database query fails, THE Backend SHALL return a JSON error response with an HTTP status code of 500 and a descriptive `message` field.
5. THE Backend SHALL enable CORS for requests originating from the Frontend origin.
6. THE Backend SHALL serve all query definitions (SQL text, metadata) from a centralized query service module, not inline within route handlers.
7. WHEN the Database is unreachable at startup, THE Backend SHALL log a warning and continue running so that Mock_Data endpoints remain available.

---

### Requirement 13: Database Schema and Seed Data

**User Story:** As a developer, I want a well-defined PostgreSQL schema with seed data, so that the application has realistic data to query and display.

#### Acceptance Criteria

1. THE Database SHALL contain tables for all eight Entities: Customer, Restaurant, Orders, Menu_Item, Delivery_Partner, Delivers, Payment, Ratings.
2. THE Database schema SHALL define appropriate primary keys, foreign keys, and constraints for each Entity table.
3. THE Database SHALL be seeded with at minimum 50 records per primary Entity table (Customer, Restaurant, Orders, Menu_Item, Delivery_Partner).
4. THE Database SHALL include at minimum one PL/pgSQL trigger on the Payment table that automatically updates payment status based on amount or other conditions.
5. THE Database SHALL include at minimum three PL/pgSQL functions covering aggregation or business logic relevant to the food delivery domain.
6. THE Database schema and seed data SHALL be provided as SQL files in a `/database` directory.

---

### Requirement 14: Mock Data Fallback

**User Story:** As a user, I want the application to remain functional and visually complete even when the database is unavailable, so that I can demonstrate the UI during environments without a live database connection.

#### Acceptance Criteria

1. THE Frontend SHALL include a Mock_Data module containing static representative data for all eight Entities.
2. THE Frontend SHALL include Mock_Data for all predefined queries, KPI values, chart data, and function outputs.
3. WHEN the Backend returns a network error or non-2xx response, THE Frontend SHALL automatically fall back to Mock_Data for that request.
4. WHEN Mock_Data is being displayed, THE Frontend SHALL show a non-intrusive "Demo Mode" badge in the UI.
5. THE Mock_Data module SHALL be organized to mirror the structure of Backend API responses so that components require no conditional rendering logic beyond the fallback switch.

---

### Requirement 15: Project Setup and Documentation

**User Story:** As a developer, I want clear setup instructions and a clean folder structure, so that I can install, configure, and run the application quickly.

#### Acceptance Criteria

1. THE App SHALL include a `README.md` at the project root with step-by-step setup instructions covering: prerequisites, environment variable configuration, database initialization, backend startup, and frontend startup.
2. THE App SHALL organize frontend source code under a `client/src` directory with subdirectories for `components`, `pages`, `hooks`, `services`, and `data` (mock data).
3. THE App SHALL organize backend source code under a `server/src` directory with subdirectories for `routes`, `controllers`, `services`, and `db`.
4. THE App SHALL include a `.env.example` file at the project root listing all required environment variables with placeholder values.
5. THE database SQL files SHALL be located in a `/database` directory containing at minimum `schema.sql` and `seed.sql` files.
