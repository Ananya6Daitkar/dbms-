# Implementation Plan: Food Delivery Query Lab

## Overview

Build a full-stack web application with a React 18 + Vite frontend, Node.js + Express backend, and PostgreSQL database. The implementation follows a bottom-up approach: project scaffolding → database layer → backend API → mock data → frontend pages → property-based tests. Every data-fetching path includes a mock fallback so the UI works without a live database.

## Tasks

- [x] 1. Project scaffolding and configuration
  - Initialize monorepo with `client/` (Vite + React 18) and `server/` directories
  - Install frontend dependencies: react-router-dom v6, axios, tailwindcss, framer-motion, recharts, lucide-react, fast-check, vitest, @testing-library/react
  - Install backend dependencies: express, pg, cors, dotenv, supertest, vitest
  - Configure Tailwind CSS with the dark theme (background ~#0a0a0f, neon green #00ff88, purple #a855f7)
  - Create `.env.example` listing `DATABASE_URL`, `PORT`, `CLIENT_ORIGIN`
  - Set up `client/src` subdirectories: `components/`, `pages/`, `hooks/`, `services/`, `data/`
  - Set up `server/src` subdirectories: `routes/`, `controllers/`, `services/`, `db/`
  - Create `database/` directory with empty `schema.sql` and `seed.sql` placeholders
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 2. Database schema and seed data
  - [x] 2.1 Write `database/schema.sql` with all eight entity tables
    - Define Customer, Restaurant, Orders, Menu_Item, Delivery_Partner, Delivers, Payment, Ratings tables with primary keys, foreign keys, and constraints exactly as specified in the design
    - _Requirements: 13.1, 13.2_

  - [x] 2.2 Write `database/seed.sql` with representative data
    - Insert ≥ 50 records each for Customer, Restaurant, Orders, Menu_Item, Delivery_Partner
    - Insert matching records for Delivers, Payment, Ratings
    - _Requirements: 13.3_

  - [x] 2.3 Add PL/pgSQL functions and trigger to `database/schema.sql`
    - Implement `get_total_orders(cust_id INT)`, `total_revenue()`, `avg_menu_price()` functions
    - Implement `set_payment_status()` trigger function and `payment_status_trigger` BEFORE INSERT OR UPDATE on Payment
    - _Requirements: 13.4, 13.5_

- [ ] 3. Backend — database connection and query service
  - [x] 3.1 Implement `server/src/db/pool.js`
    - Create pg Pool using `DATABASE_URL` from environment variables
    - Log a warning (not an error) if the database is unreachable at startup; do not crash the process
    - _Requirements: 12.2, 12.7_

  - [x] 3.2 Implement `server/src/services/queryService.js`
    - Export a registry of all 15 predefined queries (s01–s10, c01–c05) as objects with `id`, `title`, `category`, `difficulty`, `sql`, `entities`, `explanation`, `insight` fields
    - Export a `getQuery(id)` function that returns the query object or throws for unknown IDs
    - _Requirements: 12.6, 5.6_

  - [ ]* 3.3 Write unit tests for `queryService.js`
    - Assert every query ID resolves to an object with all required fields
    - Assert `getQuery` throws for an unknown ID
    - _Requirements: 12.6_

- [ ] 4. Backend — routes and controllers
  - [x] 4.1 Implement Express app entry point (`server/src/index.js`)
    - Configure CORS for `CLIENT_ORIGIN`, JSON body parsing, and mount all route groups under `/api`
    - _Requirements: 12.1, 12.3, 12.5_

  - [x] 4.2 Implement `GET /api/dashboard/kpis` and `GET /api/dashboard/charts`
    - `dashboardController.getKpis`: query active order count, average delivery time, new restaurant count; return `{ activeOrders, avgDeliveryTime, newRestaurants }`
    - `dashboardController.getCharts`: query monthly order trend and revenue by restaurant; return `{ orderTrend, revenueByRestaurant }`
    - Return HTTP 500 with `{ message }` on database error
    - _Requirements: 3.3, 4.4, 12.4_

  - [x] 4.3 Implement `POST /api/queries/run`
    - `queryController.runQuery`: look up query by `id` from request body using `queryService.getQuery`; execute SQL against pg pool; return `{ columns, rows, insight }`
    - Return HTTP 400 for unknown query ID; HTTP 500 on database error
    - _Requirements: 6.4, 12.4_

  - [x] 4.4 Implement `GET /api/entities/:name`
    - `entityController.getEntity`: map entity name to table name; execute `SELECT *`; return `{ columns, rows, total }`
    - Return HTTP 400 for unknown entity name; HTTP 500 on database error
    - _Requirements: 8.2, 12.4_

  - [x] 4.5 Implement `POST /api/functions/run`
    - `functionController.runFunction`: map function name to pg call; execute and return `{ result }`
    - Return HTTP 400 for unknown function name; HTTP 500 on database error
    - _Requirements: 9.2, 12.4_

  - [x] 4.6 Implement `POST /api/triggers/payment`
    - `triggerController.simulatePayment`: capture before-state, INSERT into Payment (triggering `payment_status_trigger`), fetch after-state; return `{ before, after, triggerFired: true }`
    - Return HTTP 500 on database error
    - _Requirements: 10.3, 12.4_

  - [ ]* 4.7 Write integration tests for all backend routes using supertest
    - Test each route returns the correct response shape with a test database
    - Test error responses (400 for unknown IDs, 500 for DB errors)
    - _Requirements: 12.3, 12.4_

- [ ] 5. Checkpoint — backend complete
  - Ensure all backend tests pass, ask the user if questions arise.

- [ ] 6. Frontend — mock data module and Axios interceptor
  - [x] 6.1 Implement `client/src/data/mockData.js`
    - Export `mockKpis`, `mockCharts`, `mockQueryResults` (keyed by query ID for all 15 queries), `mockEntities` (keyed by entity name for all 8 entities), `mockFunctions` (keyed by function name), `mockTrigger`
    - Each entry must mirror the exact API response shape defined in the design
    - _Requirements: 14.1, 14.2, 14.5_

  - [ ]* 6.2 Write property test P1: mock data mirrors API response shape
    - **Property 1: Mock data mirrors API response shape**
    - For each endpoint key, assert mock entry has same keys and value types as the API interface
    - Use `fc.constantFrom(...endpointKeys)` to generate endpoint selections
    - **Validates: Requirements 14.5**

  - [x] 6.3 Implement `client/src/services/api.js` with Axios interceptor
    - Configure Axios base URL pointing to the backend
    - Add response interceptor: on success return `response.data`; on error call `resolveMockData(url, config)` and return `{ ...mockData, _isMock: true }`
    - Implement `resolveMockData` mapping request URLs to the correct mock data entry
    - _Requirements: 14.3, 14.4_

  - [ ]* 6.4 Write property test P7: mock fallback is invoked for any API error on any endpoint
    - **Property 7: Mock fallback universality**
    - Generate combinations of endpoints and error types (network, 500, 404, 503); assert mock data is returned with `_isMock: true`
    - Use `fc.tuple(fc.constantFrom(...endpoints), fc.constantFrom('network', '500', '404', '503'))`
    - **Validates: Requirements 3.4, 4.5, 6.10, 8.6, 9.7, 10.8, 14.3**

  - [ ]* 6.5 Write unit tests for mock data completeness
    - Assert every query ID, entity name, and function name has a corresponding mock entry
    - _Requirements: 14.1, 14.2_

- [ ] 7. Frontend — shared components
  - [x] 7.1 Implement `SyntaxHighlighter` component
    - Token-based highlighter for SQL keywords, table names, string literals, and numeric literals using distinct color classes from the design palette
    - _Requirements: 6.1, 6.2_

  - [ ]* 7.2 Write property test P14: SyntaxHighlighter produces distinct color tokens for all SQL token types
    - **Property 14: SyntaxHighlighter token colors**
    - Generate SQL strings containing at least one keyword, table name, string literal, and numeric literal; assert each token type gets a distinct color class
    - **Validates: Requirements 6.2**

  - [ ]* 7.3 Write unit tests for SyntaxHighlighter
    - Given a SQL string, assert output contains colored tokens for keywords, table names, strings, and numbers
    - _Requirements: 6.2_

  - [x] 7.4 Implement `ResultTable` component
    - Render `columns` as header cells and `rows` as table rows
    - Paginate at 50 rows per page with page navigation controls
    - Show "No results" row when rows array is empty
    - Accept `isLoading` prop to show skeleton placeholder
    - _Requirements: 6.6, 6.7, 8.3_

  - [ ]* 7.5 Write property test P9: ResultTable renders all columns and rows from any result set
    - **Property 9: Result table renders all columns/rows**
    - Generate result sets with varying columns and rows; assert exactly N column headers and M row elements (up to page size)
    - Use `fc.record({ columns: fc.array(fc.string(), {minLength:1}), rows: fc.array(fc.object()) })`
    - **Validates: Requirements 6.6, 8.3**

  - [ ]* 7.6 Write property test P10: ResultTable paginates at exactly 50 rows per page
    - **Property 10: Pagination at 50 rows**
    - Generate result sets with > 50 rows; assert at most 50 rows rendered per page and total pages equals `Math.ceil(rows.length / 50)`
    - Use `fc.array(fc.object(), { minLength: 51, maxLength: 500 })`
    - **Validates: Requirements 6.7**

  - [ ]* 7.7 Write unit tests for ResultTable pagination
    - Test page navigation, edge cases (exactly 50 rows, 51 rows), and empty state
    - _Requirements: 6.7_

  - [x] 7.8 Implement `KPICard` component
    - Display label, animated counter (0 → value, ≤ 2000ms), unit/descriptor, optional sparkline, and loading skeleton
    - _Requirements: 3.2, 3.5, 3.6_

  - [ ]* 7.9 Write unit tests for KPICard
    - Test loading skeleton renders, counter animation triggers, and label/unit display
    - _Requirements: 3.2, 3.5, 3.6_

  - [x] 7.10 Implement `FloatingBackground` component
    - Animated floating particles/geometric shapes rendered on every page
    - _Requirements: 1.5_

  - [x] 7.11 Implement `Navbar` component
    - Persistent top nav with links to all seven pages; collapses to hamburger menu below 768px viewport width
    - _Requirements: 1.1, 1.6_

- [ ] 8. Frontend — application shell and routing
  - [x] 8.1 Implement `App.jsx` with React Router v6 routes
    - Define routes for `/` (Landing), `/dashboard`, `/query-lab`, `/entities`, `/functions`, `/trigger-demo`, `/presentation`
    - Add catch-all route that redirects to `/`
    - Render `FloatingBackground` and `Navbar` outside the route outlet
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 8.2 Write property test P13: unknown routes always redirect to the Landing Page
    - **Property 13: Unknown routes redirect**
    - Generate random path strings not matching known routes; assert router redirects to `/`
    - Use `fc.string().filter(s => !knownRoutes.includes(s))`
    - **Validates: Requirements 1.3**

- [ ] 9. Frontend — Landing Page
  - [x] 9.1 Implement `LandingPage` with `HeroSection`, `EntityCardGrid`, and `IsometricCityMap`
    - Hero section: title "Food Delivery Query Lab", subtitle, CTA button navigating to `/dashboard`
    - Staggered Framer Motion entrance animations for title, subtitle, and entity cards
    - Tilt/parallax effect on entity card hover
    - Isometric city map as decorative section
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 2.7_

  - [x] 9.2 Implement `EntityCardGrid` rendering one card per entity (8 total)
    - Each card shows entity name and icon; floating animation style
    - _Requirements: 2.3_

  - [ ]* 9.3 Write property test P15: all eight entity cards are rendered on the Landing Page
    - **Property 15: Entity card count invariant**
    - Generate entity lists of varying length; assert rendered card count matches list length and each card displays the entity name
    - Use `fc.array(entityArb, { minLength: 1, maxLength: 20 })`
    - **Validates: Requirements 2.3_

- [ ] 10. Frontend — Dashboard
  - [x] 10.1 Implement `Dashboard` page fetching KPIs and charts via `api.js`
    - Fetch `GET /api/dashboard/kpis` and render three `KPICard` components with counter animation
    - Show skeleton placeholders while loading
    - Show "Demo Mode" badge when `_isMock: true`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ]* 10.2 Write property test P5: KPI values are always non-negative numbers
    - **Property 5: KPI non-negative invariant**
    - Generate random KPI objects; assert `activeOrders`, `avgDeliveryTime`, `newRestaurants` are all >= 0
    - Use `fc.record({ activeOrders: fc.nat(), avgDeliveryTime: fc.nat(), newRestaurants: fc.nat() })`
    - **Validates: Requirements 3.1, 3.3, 3.4, 3.5**

  - [x] 10.3 Implement Recharts line chart (monthly order trend) and bar chart (orders by restaurant)
    - Animate chart elements into view on viewport entry
    - Use dark theme palette with neon accent colors for data series
    - Fetch `GET /api/dashboard/charts`; fall back to mock data on error
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

- [ ] 11. Frontend — Query Lab
  - [x] 11.1 Implement `QueryLab` page with query card list and filter controls
    - Render all queries as `QueryCard` components in a grid/list layout
    - Add category filter and difficulty filter controls
    - Staggered Framer Motion entrance animation on page load
    - Hover glow effect using neon accent colors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 11.2 Write property test P8: query card filter returns only matching cards for any filter value
    - **Property 8: Query card filter correctness**
    - Generate filter values and query lists; assert every card in filtered result matches the filter and no non-matching card appears
    - Use `fc.tuple(fc.constantFrom(...categories, ...difficulties), fc.array(queryArb))`
    - **Validates: Requirements 5.3, 5.4**

  - [x] 11.3 Implement `ExpandedQueryCard` with `SyntaxHighlighter`, run button, `ResultTable`, and `InsightSummary`
    - On card click, expand to show SQL with syntax highlighting
    - "RUN QUERY" button sends `POST /api/queries/run` with query ID; shows loading indicator during request
    - Animate `ResultTable` into view on result arrival
    - Display `InsightSummary` below results
    - Show error message inside card (without collapsing) on failure
    - Show "Demo Mode" badge when `_isMock: true`
    - _Requirements: 6.1, 6.3, 6.4, 6.5, 6.8, 6.9, 6.10, 7.1_

  - [ ]* 11.4 Write property test P2: query result always returns the normalized shape
    - **Property 2: Query result normalized shape**
    - Generate random query IDs from the registry; assert result has `columns` (non-empty string array), `rows` (array of objects), and `insight` (non-empty string)
    - Use `fc.constantFrom(...queryIds)`
    - **Validates: Requirements 6.4, 6.6, 7.1**

  - [x] 11.5 Implement `ExplanationPanel` (right panel) and `RelationshipStrip`
    - Explanation panel visible whenever a query card is expanded; shows plain-English description
    - Relationship strip lists entity names as colored chips/badges
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [ ]* 11.6 Write property test P11: relationship strip contains all entities listed in any query definition
    - **Property 11: Relationship strip completeness**
    - Generate query definitions with entity arrays of varying length; assert strip displays exactly N entity chips matching the entities array
    - Use `fc.record({ entities: fc.array(fc.constantFrom(...entityNames), {minLength:1}) })`
    - **Validates: Requirements 7.4**

- [ ] 12. Frontend — Entity Browser
  - [x] 12.1 Implement `EntityBrowser` page with entity selector tabs and data table
    - Render tabs for all 8 entities; on tab select fetch `GET /api/entities/:entityName`
    - Show loading skeleton while fetching; display total record count
    - Show "Demo Mode" badge when `_isMock: true`
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6, 8.7_

  - [x] 12.2 Implement `SearchInput` with debounce hook and client-side row filtering
    - Implement `useDebounce` hook (delay configurable, default 300ms)
    - Filter displayed rows within 300ms of last keystroke; match any field value (case-insensitive substring)
    - _Requirements: 8.4, 8.8_

  - [ ]* 12.3 Write property test P3: entity response always returns the normalized shape with consistent total
    - **Property 3: Entity response normalized shape**
    - Generate random valid entity names; assert result has `columns` (non-empty string array), `rows` (array of objects), and `total === rows.length`
    - Use `fc.constantFrom(...entityNames)`
    - **Validates: Requirements 8.2, 8.3, 8.7**

  - [ ]* 12.4 Write property test P12: entity search filter returns only rows containing the search string
    - **Property 12: Entity search filter correctness**
    - Generate search strings and row data; assert filtered rows all contain the search string in at least one field (case-insensitive), and no non-matching row appears
    - Use `fc.tuple(fc.string({minLength:1}), fc.array(fc.object()))`
    - **Validates: Requirements 8.4**

  - [ ]* 12.5 Write unit tests for useDebounce hook
    - Assert value updates are delayed by the specified ms; assert immediate update when delay is 0
    - _Requirements: 8.8_

- [ ] 13. Checkpoint — core pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Frontend — Functions Page
  - [x] 14.1 Implement `FunctionsPage` with function cards and output panel
    - List all 3 PL/pgSQL functions with name, description, and parameter input fields
    - On submit, call `POST /api/functions/run` with function name and parameters; show loading indicator
    - Display return value in formatted output panel; show error message on failure
    - Show mock output when `_isMock: true`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [ ] 15. Frontend — Trigger Demo
  - [x] 15.1 Implement `TriggerDemo` page with payment form, BEFORE/AFTER panels, and state transition animation
    - Payment form with order ID, amount, and initial status fields
    - BEFORE panel shows entered values before submission
    - On submit, call `POST /api/triggers/payment`; animate transition to AFTER panel using Framer Motion
    - Highlight changed fields (status) with neon accent color
    - Show trigger status indicator (fired / not fired)
    - Simulate trigger client-side using mock logic when `_isMock: true`; show "Simulated" indicator
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ]* 15.2 Write property test P4: trigger response always returns the normalized shape
    - **Property 4: Trigger response normalized shape**
    - Generate random payment inputs; assert result has `before` (payment record object), `after` (payment record object), and `triggerFired` (boolean)
    - Use `fc.record({ orderId: fc.integer(), amount: fc.float(), status: fc.option(fc.string()) })`
    - **Validates: Requirements 10.3, 10.4**

  - [ ]* 15.3 Write property test P6: payment trigger enforces status rules for all input combinations
    - **Property 6: Payment trigger status rules**
    - Generate random amounts and statuses; assert: amount <= 0 → after.status === 'Invalid'; amount > 0 and null/empty status → after.status === 'Pending'; amount > 0 and non-empty status → after.status unchanged
    - Use `fc.record({ amount: fc.float({ min: -1000, max: 1000 }), status: fc.option(fc.string()) })`
    - **Validates: Requirements 10.3, 10.4, 10.5, 10.8, 13.4**

  - [ ]* 15.4 Write unit tests for trigger controller mock logic
    - Unit test the `set_payment_status` equivalent in JS for the mock path
    - _Requirements: 10.8_

- [ ] 16. Frontend — Presentation Mode
  - [x] 16.1 Implement `PresentationMode` page with fullscreen layout and slide renderer
    - Hide standard navbar; use larger typography (≥ 1.25× standard font size)
    - Define guided slide sequence: Landing overview, Dashboard KPIs, Query Lab demo, Entity Browser, Functions, Trigger Demo
    - Next/Previous navigation with animated transitions between slides
    - Progress indicator showing current step and total steps
    - Exit on Escape key press, returning to standard app view
    - Accessible from `/presentation` route and from a navbar button
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

- [ ] 17. Final wiring and README
  - [x] 17.1 Wire all pages into the router and verify navigation links in Navbar
    - Confirm all seven routes render the correct page component
    - Confirm catch-all redirect to `/` works
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 17.2 Write `README.md` at project root
    - Include: prerequisites, environment variable configuration, database initialization steps, backend startup command, frontend startup command
    - _Requirements: 15.1_

- [ ] 18. Final checkpoint — Ensure all tests pass
  - Run the full test suite (unit tests and property tests); ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints at tasks 5, 13, and 18 ensure incremental validation
- Property tests use fast-check with a minimum of 100 iterations per property
- Unit tests and property tests are complementary — both should be present for critical paths
- The mock data fallback (task 6) must be complete before any frontend page work begins
