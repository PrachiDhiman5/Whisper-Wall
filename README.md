🕵️ Whisper Wall - Anonymous Confession Platform (MERN Stack)

A full-stack anonymous confession platform built using the MERN stack that allows users to securely log in using Google OAuth, post anonymous confessions, and interact with content in a secure and scalable way.

🚀 Features

🔐 Google Authentication (OAuth 2.0)

🎟 JWT-based Stateless Authentication

🧠 Anonymous User Identity System

📝 Create & View Confessions

🔒 Protected Routes with Middleware

🌍 RESTful API Architecture

⚡ Axios Interceptors for Secure Requests

🧩 React Context API for Global State Management

🗄 MongoDB for Persistent Data Storage

🏗 Tech Stack
Frontend

React.js

React Router

Context API

Axios

Vanilla CSS

Backend

Node.js

Express.js

Passport.js (Google OAuth Strategy)

JSON Web Token (JWT)

MongoDB & Mongoose

🔐 Authentication Flow

User clicks "Login with Google"

Frontend calls backend route: /auth/google

Passport redirects user to Google login

Google authenticates user

Google sends user profile to backend callback

Backend:

Checks if user exists in MongoDB

Creates user if not exists

Generates JWT token

Backend redirects user to frontend with token

Frontend stores token in localStorage

Axios interceptor automatically attaches token to future API requests

Backend middleware verifies JWT for protected routes

🧠 Architecture Overview
Stateless Authentication

This project uses stateless authentication:

No sessions stored on server

All authentication data stored inside JWT

Token verified on every request

Highly scalable architecture

Database Structure
User Collection
{
  _id: ObjectId,
  googleId: String,
  name: String,
  email: String,
  profilePicture: String,
  anonymousId: String
}

Confession Collection
{
  _id: ObjectId,
  text: String,
  category: String,
  secretCode: String,
  userId: ObjectId (reference to User),
  isDraft: Boolean,
  reactions: Object,
  createdAt: Date,
  updatedAt: Date
}


Relationship:

User (1) → (Many) Confessions

📂 Project Structure
client/
│
├── src/
│   ├── context/
│   ├── components/
│   ├── pages/
│   └── utils/axiosInstance.js
│
server/
│
├── controllers/
├── routes/
├── middleware/
├── models/
├── config/
└── server.js

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/yourusername/anonymous-confession-platform.git
cd anonymous-confession-platform

2️⃣ Setup Backend
cd server
npm install


Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


Run backend:

npm start

3️⃣ Setup Frontend
cd client
npm install
npm start

🔒 Protected Routes Example

Backend Middleware:

const token = req.headers.authorization?.split(" ")[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;


Frontend Axios Interceptor:

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

🎯 Key Concepts Implemented

OAuth 2.0 Authentication

JWT Signing & Verification

Express Middleware Pattern

REST API Design

MongoDB Relationships

Context API for Global State

Secure Route Handling

Clean MVC Backend Architecture

📈 Scalability

Because the system uses JWT-based stateless authentication:

No session memory required

Can scale across multiple servers

Suitable for cloud deployment

Load balancer friendly

💡 Future Improvements

Role-based access control (Admin/User)

Refresh Token mechanism

Pagination & filtering

Real-time reactions using Socket.io

Rate limiting & security hardening

Unit & integration testing

👩‍💻 Author

Prachi Dhiman
B.Tech CSE | Full Stack Developer
Focused on scalable backend architecture & secure authentication systems.

⭐ If You Like This Project

Give it a ⭐ on GitHub!
