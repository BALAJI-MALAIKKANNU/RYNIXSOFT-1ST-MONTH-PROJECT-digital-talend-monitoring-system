# Digital Talent Management System (DTMS)

[![Stack - MERN](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://react.dev)
[![AI - Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Real-Time - Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-black?style=for-the-badge&logo=socketdotio)](https://socket.io)
[![Database - MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Auth - Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![License - MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

The **Digital Talent Management System (DTMS)** is a comprehensive, production-ready full-stack application designed to streamline task delegation, evaluation, real-time collaboration, and AI-driven automation between **Administrators** (managers, professors) and **Users** (employees, students). 

Built on the modern **MERN stack**, DTMS features an elegant, fully responsive UI designed for all device screens and integrates key services like **Firebase Authentication/Storage**, **Socket.io** for instant communication, and **Google Gemini AI** for intelligent assistance.

---

## 🚀 Key Features

### 👤 Role-Based Access Control (RBAC)
- **Admin Dashboard**: Create and manage tasks, build and group teams, evaluate user submissions with AI assistance, and globally chat with any registered user.
- **User Dashboard**: Track personal assigned tasks, submit work deliverables (with file attachments hosted via Firebase Storage), view grades/feedback, and message Admins.

### 📋 Advanced Task Management Pipeline
- **Workflow Stages**: Seamlessly track task progression: `Pending` ➔ `In Progress` ➔ `Needs Review` ➔ `Completed`.
- **Validation Engine**: Enforces strict submission deadlines. Late submissions are blocked.
- **Team-wide Delegation**: Assign tasks to a team, and the backend automatically duplicates individual task cards for all team members to ensure individual accountability.

### 💬 Real-Time Messaging ("Mini WhatsApp")
- **Instant Messaging**: Seamless, low-latency persistent chat powered by **Socket.io** with live online status indicators.
- **Read Receipts**: Blue check marks (`✓✓`) appear instantly when the recipient reads your messages.
- **Typing Indicators**: Live pulsing animations tell you when the other user is typing.
- **Message Deletion**: Users can delete messages for everyone in real-time.
- **Unread Notification Badges**: Keep track of unseen messages from different channels.

### 🤖 Google Gemini AI Integration
- **AI Task Description Writer**: Automatically converts short task titles into descriptive, professional project tasks.
- **Duration Estimator**: Analyzes task complexity and recommends logical timelines.
- **Grading Assistant**: Evaluates submission notes and suggests grades and professional feedback for Admins.
- **Profile Bio Enhancer**: Instantly builds high-impact corporate bios for users.
- **Skill Recommender**: Recommends skills to learn based on user department and interests.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React Client SPA / Vite] <-->|HTTPS / Axios| Server[Express Server / Node.js]
    Client <-->|WebSockets / Socket.io| Server
    Client <-->|Firebase SDK / Auth & Files| Firebase[Google Firebase]
    Server <-->|ODM / Mongoose| DB[(MongoDB Atlas)]
    Server <-->|Generative AI SDK| Gemini[Google Gemini API]
    Server -.->|SMTP / Nodemailer| MailServer[SMTP Email Server]
```

### Flow Walkthroughs:
1. **Authentication Flow**: User registers/logs in through the client via **Firebase Auth** ➔ Receives a JSON Web Token (JWT) ➔ Axios attaches token in request headers ➔ Backend decrypts and verifies the token via **Firebase Admin SDK** before granting API access.
2. **Real-Time Communication**: Sender sends message ➔ WebSocket event emitted to backend ➔ Backend saves to **MongoDB** ➔ Backend pushes the message to recipient's room ➔ Client updates state and shows read/typing indicators instantly.
3. **AI Generation**: User clicks "Auto-Write" or "Evaluate" ➔ Frontend requests backend endpoint ➔ Server securely signs request using backend `GEMINI_API_KEY` ➔ Communicates with Google's Generative AI models ➔ Feeds structured response back to client.

---

## 📂 Directory Structure

```text
RYNIXSOFT-1ST-MONTH-PROJECT-digital-talend-monitoring-system/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static Assets
│   ├── src/
│   │   ├── components/     # UI, Auth, and Layout components
│   │   ├── pages/          # Page views (Dashboard, Messages, TaskManager, etc.)
│   │   ├── lib/            # SDK instances (Firebase, Socket.io client)
│   │   └── App.jsx         # Routes & Auth Providers
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express Backend (Node.js)
│   ├── src/
│   │   ├── controllers/    # API Request Handlers
│   │   ├── models/         # Mongoose Schemas (User, Task, Team, Message)
│   │   ├── routes/         # Express API Routes
│   │   └── services/       # External integrations (Gemini, Mailer)
│   ├── server.js           # Server startup & Socket.io handler
│   └── package.json
├── .github/
│   ├── workflows/          # GitHub Actions (CI build & lint check)
│   └── ISSUE_TEMPLATE/     # Community Issue Templates
├── LICENSE                 # MIT License file
└── README.md               # Project documentation (This file)
```

---

## 🛠️ Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas cluster URI)
- [Firebase account](https://console.firebase.google.com) (For authentication keys and storage configuration)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/BALAJI-MALAIKKANNU/RYNIXSOFT-1ST-MONTH-PROJECT-digital-talend-monitoring-system.git
cd RYNIXSOFT-1ST-MONTH-PROJECT-digital-talend-monitoring-system
```

### Step 2: Configure Environment Variables

Create `.env` files in both the client and server directories:

#### 1. Frontend Configuration (`client/.env`)
Copy the template from `client/.env.example`:
```bash
cp client/.env.example client/.env
```
Fill in your configuration:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 2. Backend Configuration (`server/.env`)
Copy the template from `server/.env.example`:
```bash
cp server/.env.example server/.env
```
Fill in your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_admin_sdk_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your_jwt_secret_key
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

---

### Step 3: Run the Application

You can run both client and server locally in parallel.

#### Run Backend Server
```bash
cd server
npm install
npm run dev
```
The server will boot on `http://localhost:5000`.

#### Run Frontend Client
```bash
cd client
npm install
npm run dev
```
Vite will start the client, typically on `http://localhost:5173`. Open this URL in your browser to interact with the application.

---

## 🛡️ Linting and Code Quality

To keep the frontend codebase clean, run the linter:
```bash
cd client
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
