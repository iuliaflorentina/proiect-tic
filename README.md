# EventHub - Event Management System

EventHub is a web application designed to help organizers manage events and allow users to browse and purchase tickets. The system features a modern Vue 3 frontend and a robust Node.js/Express backend integrated with Firebase for data storage and authentication.

## 🚀 Tech Stack

### Frontend
- **Vue 3**: The core framework (Composition API).
- **Vite**: Modern and fast build tool.
- **Pinia**: State management for authentication and event handling.
- **Tailwind CSS**: Utility-first CSS framework for modern and responsive styling.
- **Vue Router**: Client-side navigation management.

### Backend
- **Node.js & Express**: Runtime environment and API server.
- **Firebase Admin SDK**: Used for Firestore database.
- **JSON Web Tokens (JWT)**: Route protection and session management.
- **Express Validator**: Server-side input data validation.

## ✨ Key Features

- **Authentication**: Login and registration for both users and organizers.
- **Organizer Dashboard**:
  - Create and edit events.
  - View the list of buyers for each event (Evidence).
- **User Interface**:
  - Browse available events.
  - Purchase tickets for different categories.
  - View purchased tickets in the user profile.

## 📁 Project Structure

```text
proiect-tic/
├── backend/            # API Server (Express + Firebase)
│   ├── controllers/    # Route logic
│   ├── routes/         # Endpoint definitions
│   ├── models/         # (Models/Interfaces)
│   └── middlewares/    # Auth and validation
├── frontend/           # Vue.js Application
│   ├── src/
│   │   ├── views/      # Application pages
│   │   ├── stores/     # State management (Pinia)
│   │   └── components/ # Reusable components
└── README.md           # Project documentation
```

## 🛠️ Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A [Firebase](https://console.firebase.google.com/) project configured.

### Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Add your `serviceAccountKey.json` from Firebase into the `backend` folder.
4. Create a `.env` file with the following variables:
   ```env
   PORT=8080
   JWT_SECRET=your_secret_here
   ```
5. Start the server: `npx nodemon app.js`

### Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application in development mode: `npm run dev`
4. Open the link displayed in your browser (usually `http://localhost:5173`).

---
Project created for the TIC discipline.
