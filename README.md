# 🏥 Hospital Management API

A backend REST API for managing hospital operations including patients, doctors, appointments, and authentication.

Built using:

* Node.js
* Express.js
* MongoDB
* JWT Authentication

---

## 🚀 Features

* User Authentication (Register/Login)
* Role-based system (Admin / Doctor / Patient)
* Patient Management
* Doctor Management
* Appointment Scheduling
* Secure APIs with JWT

---

## 📁 Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/HiteshAmbaliya7/Hospital-Management-API.git
cd Hospital-Management-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file in root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run Server

```bash
npm start
```

Server will run on:

```
http://localhost:8000
```

---

## 🔐 Authentication APIs

### Register User

```
POST /api/auth/register
```

👉 Creates a new user (Doctor/Patient)

### Login User

```
POST /api/auth/login
```

👉 Returns JWT token

---

## 👨‍⚕️ Doctor APIs

### Get All Doctors

```
GET /api/doctors
```

### Get Doctor by ID

```
GET /api/doctors/:id
```

### Create Doctor

```
POST /api/doctors
```

### Update Doctor

```
PUT /api/doctors/:id
```

### Delete Doctor

```
DELETE /api/doctors/:id
```

---

## 🧑‍🤝‍🧑 Patient APIs

### Get All Patients

```
GET /api/patients
```

### Get Patient by ID

```
GET /api/patients/:id
```

### Create Patient

```
POST /api/patients
```

### Update Patient

```
PUT /api/patients/:id
```

### Delete Patient

```
DELETE /api/patients/:id
```

---

## 📅 Appointment APIs

### Create Appointment

```
POST /api/appointments
```

### Get All Appointments

```
GET /api/appointments
```

### Get Appointment by ID

```
GET /api/appointments/:id
```

### Update Appointment

```
PUT /api/appointments/:id
```

### Delete Appointment

```
DELETE /api/appointments/:id
```

---

## 🔒 Protected Routes

* Require JWT Token in headers:

```
Authorization: Bearer <token>
```

---

## 📦 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 🛠️ Future Improvements

* Email/SMS Notifications
* Role-based access control (RBAC)
* Payment Integration
* Admin Dashboard

---

## 👨‍💻 Author

**Hitesh Ambaliya**

GitHub: https://github.com/HiteshAmbaliya7

---
