# 🚀 Learnix – Real-Time Learning & Collaboration Platform

Learnix is a modern full-stack web application designed to enable seamless real-time communication, collaboration, and learning experiences. It integrates a powerful backend with an interactive frontend to support features like authentication, video calling, and live user interaction.

---

## 🌟 Features

* 🔐 User Authentication (JWT-based)
* 📡 Real-time Communication (Socket.IO)
* 🎥 Video Calling Functionality
* 👥 Live User Presence Tracking
* ⚡ Fast and Scalable Backend APIs
* 🎨 Modern UI with Responsive Design

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS

### Backend

* FastAPI
* Python
* Socket.IO

### Database

* Supabase (PostgreSQL)

---

## 📂 Project Structure

```
Learnix/
│── frontend/     # Next.js frontend
│── backend/      # FastAPI backend
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/khushi0402/Learnix.git
cd Learnix
```

---

### 🔹 2. Backend Setup

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend will run on:
👉 http://127.0.0.1:8000

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:
👉 http://localhost:3000

---

## 🗄️ Database

* Supabase is used as the database
* It provides:

  * PostgreSQL database
  * Authentication support
  * Real-time capabilities

---

## 🔑 Environment Variables

Create a `.env` file in both frontend and backend (if required) and add:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_secret_key
```

---

## 🚀 Future Improvements

* 📱 Mobile responsiveness enhancements
* 🔔 Notifications system
* 📊 Dashboard analytics
* 🌐 Deployment & scaling

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

For any queries or collaboration:

* 📧 Reach out via LinkedIn or GitHub

---

⭐ If you like this project, don’t forget to give it a star!
