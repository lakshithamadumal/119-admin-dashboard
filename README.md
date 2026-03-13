# 119 Admin Dashboard

Production-oriented admin dashboard UI for emergency operations, incident reporting, SOS handling, user management, and notification workflows.

This repository currently focuses on the frontend experience and page-level interaction patterns. It is designed to be connected to a Java EE backend and Firebase services.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Technology Stack](#technology-stack)
4. [Current Repository Scope](#current-repository-scope)
5. [Architecture and Data Flow](#architecture-and-data-flow)
6. [Folder Structure](#folder-structure)
7. [Run Locally](#run-locally)
8. [Java EE and Firebase Integration Guide](#java-ee-and-firebase-integration-guide)
9. [Routing Notes](#routing-notes)
10. [Configuration Notes](#configuration-notes)
11. [Security Notes](#security-notes)
12. [Build and Deployment Notes](#build-and-deployment-notes)
13. [Troubleshooting](#troubleshooting)
14. [Recommended Next Steps](#recommended-next-steps)

## Project Overview

The 119 Admin Dashboard is a web-based operations console for emergency workflows.

Core goals:

- Provide at-a-glance monitoring for reports, SOS requests, active incidents, and membership/payment status.
- Give operators quick access to details pages and map locations.
- Support operational actions such as status updates, category management, notifications, and settings adjustments.
- Offer a frontend foundation that can be connected to Java EE APIs and Firebase cloud capabilities.

## Main Features

- Dashboard widgets for total reports, SOS count, active emergencies, and member totals.
- Emergency report management with detail modal and status update actions.
- SOS request listing and filtering.
- User management with detailed profile modal (account, medical, contacts, subscription, report history).
- Category management (add, edit, delete) with icon upload and preview.
- Notification composer and filtering.
- Settings management with local persistence (`subscriptionPriceLkr`, operator contact).
- Standalone detail pages:
	- `report-details.html`
	- `sos-details.html`
- Live map page (`map.html`) for incident coordinates.
- Simulated emergency alert modal + sound behavior from dashboard.

## Technology Stack

Frontend:

- HTML5
- SCSS/CSS
- Vanilla JavaScript
- Bootstrap-based UI + vendor assets under `assets/vendor`

Backend (target integration):

- Java EE (REST APIs for domain and admin actions)

Cloud services (target integration):

- Firebase Authentication
- Firebase Cloud Messaging (recommended for alert push)
- Firebase Storage / Firestore (optional, based on your architecture)

## Current Repository Scope

What is included:

- Full admin UI pages and components.
- Client-side rendering modules in `js/pages/*.js`.
- In-memory/mock data in `js/data.js`.

What is not included in this repository snapshot:

- Java EE server code.
- Firebase initialization files and secrets.
- `package.json`-based frontend build scripts at root (this snapshot is runnable as static files).

## Architecture and Data Flow

Current runtime model (frontend-only):

1. `index.html` loads common scripts and shell layout.
2. `loadPage(pageName)` (in `js/app.js`) fetches `pages/<pageName>.html` into `#main-content`.
3. Page module initializers (for example `initializeReportsModule`) bind events and render content.
4. Data is read from arrays in `js/data.js`.
5. Settings are persisted in browser local storage key `dashboard_settings_v1`.

Target production model:

1. Replace direct `js/data.js` reads with API service calls.
2. Java EE backend becomes source of truth for reports, users, memberships, payments, categories, and notifications.
3. Firebase services handle auth, push notifications, and optional media/document workflows.

## Folder Structure

High-level structure:

```text
.
|-- index.html
|-- login.html
|-- map.html
|-- report-details.html
|-- sos-details.html
|-- pages/
|   |-- categories.html
|   |-- notification.html
|   |-- reports.html
|   |-- settings.html
|   |-- sos.html
|   `-- users.html
|-- js/
|   |-- app.js
|   |-- data.js
|   |-- utils.js
|   |-- report-details.js
|   |-- sos-details.js
|   `-- pages/
|       |-- categories.js
|       |-- memberships.js
|       |-- notification.js
|       |-- payments.js
|       |-- reports.js
|       |-- settings.js
|       |-- sos.js
|       `-- users.js
|-- assets/
|   |-- css/
|   |-- img/
|   |-- js/
|   `-- vendor/
|-- scss/
`-- tasks/
```

## Run Locally

Because the app uses `fetch('pages/<name>.html')`, run it on an HTTP server (do not open via `file://`).

### Option 1: VS Code Live Server

1. Open the workspace in VS Code.
2. Start a local server from the project root.
3. Open `index.html` in browser through that server URL.

### Option 2: Python HTTP server

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/index.html
```

### Option 3: Node static server

```bash
npx http-server -p 5500
```

Then open:

```text
http://localhost:5500/index.html
```

## Java EE and Firebase Integration Guide

This section describes a clean way to connect this UI to your backend stack.

### 1. Java EE API layer (recommended)

Expose REST endpoints similar to:

- `GET /api/reports`
- `GET /api/reports/{id}`
- `PATCH /api/reports/{id}/status`
- `GET /api/sos`
- `GET /api/users`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `POST /api/notifications`
- `GET /api/settings`
- `PUT /api/settings`

Backend responsibilities:

- Validation and authorization
- Role-based access control
- Audit logs for admin actions
- Data persistence
- Rate limiting for sensitive routes

### 2. Firebase usage suggestions

Recommended split:

- Firebase Auth: operator/admin authentication.
- Firebase Cloud Messaging: push emergency alerts to admin clients.
- Firebase Storage: store media files (image/audio/video) referenced by report records.
- Firestore/Realtime DB: optional for low-latency event stream mirror.

### 3. Frontend service abstraction

Create API service wrappers in a future `js/services/` folder, for example:

- `reports.service.js`
- `sos.service.js`
- `users.service.js`
- `categories.service.js`
- `notifications.service.js`
- `settings.service.js`

Then refactor page modules to call service methods instead of using direct arrays from `js/data.js`.

### 4. Example API config object

You can inject runtime config (do not hardcode secrets):

```js
window.APP_CONFIG = {
	API_BASE_URL: 'https://api.your-domain.com',
	FIREBASE_PROJECT_ID: 'your-project-id'
};
```

### 5. Migration checklist from mock data

- Keep shape compatibility between API responses and existing table renderers.
- Replace each `*Data` array reference with async service calls.
- Handle loading, empty, and error states per page.
- Add request retry behavior for transient failures.
- Add auth token handling and automatic refresh.

## Routing Notes

Dynamic subpages are loaded through `loadPage(pageName)` in `js/app.js` and fetched from `pages/<pageName>.html`.

Important route naming:

- Use `notification` (singular), not `notifications`.
- Use lowercase `settings` (matches `pages/settings.html`).
- `dashboard` route returns to `index.html`.

Standalone pages:

- `report-details.html?reportId=<id>`
- `sos-details.html?sosId=<id>`
- `map.html` (optional query params: `lat`, `lng`, `reportId`, `sosId`, `priority`)

## Configuration Notes

- Theme/vendor configuration is under `assets/js/config.js`.
- Local settings persistence key: `dashboard_settings_v1`.
- Current notification ID sequence is generated on client from existing data.

## Security Notes

- Do not store API secrets in frontend files.
- Move all sensitive write operations through authenticated Java EE endpoints.
- Enforce CORS policy from backend only for allowed origins.
- Validate all admin operations server-side even if UI validates inputs.
- Review map token usage in `map.html`; move to environment-based config if required.

## Build and Deployment Notes

This repository can be served as static files.

Suggested production flow:

1. Host frontend static assets on a web server/CDN.
2. Host Java EE backend separately (same domain via reverse proxy preferred).
3. Configure API base URL and auth strategy.
4. Configure Firebase project, roles, and security rules.
5. Enable logging and monitoring for emergency-critical endpoints.

`tasks/` contains gulp-oriented task modules that may be used in your broader build pipeline, but this snapshot does not include root package scripts.

## Troubleshooting

### Page content does not load

- Cause: opening files directly with `file://` blocks `fetch`.
- Fix: run via local HTTP server and use `http://localhost:<port>/index.html`.

### Menu route opens blank section

- Cause: route name does not match file in `pages/`.
- Fix: verify exact route names, especially `notification` and `settings`.

### Settings are not retained

- Cause: browser storage restrictions or cleared storage.
- Fix: check local storage and key `dashboard_settings_v1`.

### Alerts and detail pages not linked correctly

- Cause: mismatched ID types between UI and data source.
- Fix: keep consistent identifiers for `reportId`, `sosId`, and user IDs across backend responses.

## Recommended Next Steps

1. Add Java EE API client modules and replace direct `js/data.js` reads.
2. Add Firebase Auth + token propagation to API requests.
3. Add FCM push handling for real-time emergency alerts.
4. Move map token and environment values to deployment config.
5. Add automated tests for critical workflows (report status updates, SOS filters, notification send flow).