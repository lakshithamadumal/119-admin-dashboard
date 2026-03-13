# 119 Admin Dashboard 🚨

A production-oriented admin dashboard UI for emergency operations, incident reporting, SOS management, user administration, and notification workflows.

This project provides the frontend interface for a **119 emergency management system** and is designed to integrate with a **Java EE backend and Firebase services**.

---

# 📌 Project Overview

The **119 Admin Dashboard** is a web-based operations console used by emergency operators to monitor and manage incident reports, SOS requests, and user activity in real time.

Main goals:

* Monitor reports and emergency requests from a central dashboard
* Manage users, categories, notifications, and memberships
* Provide detailed views of incidents and SOS alerts
* Serve as a frontend layer for a **Java EE + Firebase powered system**

---

# ✨ Main Features

* 📊 Dashboard widgets for reports, SOS alerts, and emergency activity
* 🚨 Emergency report management
* 🆘 SOS request tracking
* 👥 User management with detailed profile modal
* 📂 Category management with icon upload
* 🔔 Notification composer and filtering
* ⚙️ Settings management with local storage persistence
* 📍 Map view for incident coordinates
* 📄 Standalone detail pages for reports and SOS alerts

---

# 🛠 Technology Stack

Frontend

* HTML5
* CSS / SCSS
* Vanilla JavaScript
* Bootstrap UI components

Backend (planned integration)

* Java EE REST APIs

Cloud Services (planned integration)

* Firebase Authentication
* Firebase Cloud Messaging
* Firebase Storage / Firestore

---

# 📂 Folder Structure

```
.
├── index.html
├── login.html
├── map.html
├── report-details.html
├── sos-details.html
│
├── pages/
│   ├── reports.html
│   ├── sos.html
│   ├── users.html
│   ├── categories.html
│   ├── notification.html
│   └── settings.html
│
├── js/
│   ├── app.js
│   ├── data.js
│   ├── utils.js
│   ├── report-details.js
│   ├── sos-details.js
│   └── pages/
│       ├── reports.js
│       ├── sos.js
│       ├── users.js
│       ├── categories.js
│       ├── notification.js
│       ├── settings.js
│       ├── memberships.js
│       └── payments.js
│
├── assets/
│   ├── css
│   ├── img
│   ├── js
│   └── vendor
│
├── scss
└── tasks
```

---

# ▶️ Run Locally

Because the project loads pages dynamically using `fetch()`, it must be served through a local HTTP server.

### Option 1 — VS Code Live Server

1. Open the project in **VS Code**
2. Start **Live Server**
3. Open:

```
http://localhost:<port>/index.html
```

### Option 2 — Python HTTP Server

```bash
python -m http.server 5500
```

Then open:

```
http://localhost:5500/index.html
```

### Option 3 — Node Static Server

```bash
npx http-server -p 5500
```

---

# 🔗 Backend Integration (Java EE)

Recommended REST endpoints:

```
GET    /api/reports
GET    /api/reports/{id}
PATCH  /api/reports/{id}/status
GET    /api/sos
GET    /api/users
GET    /api/categories
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
POST   /api/notifications
GET    /api/settings
PUT    /api/settings
```

The backend should handle:

* validation
* authentication
* role-based access control
* audit logging
* database persistence

---

# 🔥 Firebase Integration

Suggested Firebase usage:

* **Firebase Auth** → admin/operator login
* **Firebase Cloud Messaging** → real-time emergency alerts
* **Firebase Storage** → incident media files
* **Firestore / Realtime DB** → optional event streams

---

# 🔐 Security Notes

* Do not store API secrets in frontend files
* All sensitive actions must be validated server-side
* Use secure authentication and role-based access
* Restrict API access using proper CORS configuration

---

# 🚀 Recommended Next Steps

* Connect UI to Java EE REST APIs
* Implement Firebase authentication
* Enable real-time push notifications
* Move environment configs to deployment settings
* Add automated testing for critical workflows

---

# 📄 License

This project is intended for educational and development purposes.

---
