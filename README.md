# 🌐 AyuUnity - Full Stack Web Application for Smart Health Integration

**AyuUnity** is an innovative, full-stack health-tech platform built using **React (frontend)** and **Flask (backend)**, designed to unify smart AI-based health services under one roof. The platform supports secure patient-doctor interactions, health data management, emergency assistance, and government scheme integration, making healthcare more accessible, intelligent, and efficient.

---

## 🚀 Key Features

### 🔧 Backend (Flask)
- User Registration & Login with JWT tokens  
- Role-based access control (patients, doctors, admins)  
- Health report uploads and access  
- Emergency API trigger to notify hospitals and family  
- Modular API routes with clear separation of logic  
- Cross-origin configuration for frontend integration  

### 🎨 Frontend (React + Vite)
- Elegant dark/light themed UI with animated elements  
- Role-specific dashboards (AyuAI, AyuCare, AyuSOS, etc.)  
- Chatbot popup (AyuBot) with floating interaction  
- Aadhar + OTP-based login simulation  
- Multi-tab system: Appointments, Reports, Prescriptions, Consultations  
- Emergency button that transmits medical history instantly  

---

## 💻 Installation

### 📦 Prerequisites
- Node.js (v16+)
- Python (v3.8+)

---

### 🔙 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file in /backend/ with the following:
```
SECRET_KEY=your_secret_key

```
Run the backend server:
```
python app.py

```

Backend URL: http://localhost:5000

🔜 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:3000

🔗 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login with credentials
GET	/api/user/profile	Fetch logged-in user's profile
POST	/api/posts	Create content/post
GET	/api/posts	Fetch all content

🤝 Contributing
1. Fork the repo
2. Create a feature branch (git checkout -b feature-name)
3. Commit your changes
4. Push to origin
5. Create a Pull Request

🆘 Support
For bugs, questions, or feedback, please open an issue.

