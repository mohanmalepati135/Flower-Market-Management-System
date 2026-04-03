# 🌸 Smart Flower Market

<div align="center">

![React](https://img.shields.io/badge/React.JS-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Node](https://img.shields.io/badge/Node.JS-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express](https://img.shields.io/badge/Express.JS-000000?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge\&logo=whatsapp)

### Smart Flower Market – Digital platform for flower market transactions with automated pricing and WhatsApp notifications

</div>

---

# 📋 Table of Contents

1. Introduction
2. System Architecture
3. Tech Stack
4. Features
5. Project Workflow
6. Quick Start
7. Environment Variables
8. Screenshots
9. Future Improvements
10. Author

---

# 🤖 Introduction

**Smart Flower Market** is a full-stack MERN application designed to digitize traditional flower market operations.

The platform connects **farmers, buyers, and administrators** and automates:

* flower market transactions
* commission calculations
* price fixing
* settlement tracking
* WhatsApp notifications

The system eliminates manual bookkeeping and enables **real-time transaction management with automated pricing.**

---

# 🏗 System Architecture

```
Farmers / Buyers / Admin
        │
        ▼
   React Frontend (UI)
        │
        ▼
 Node.js + Express Backend
        │
        ▼
      MongoDB Database
        │
        ▼
 WhatsApp Notification Service
```

---

# ⚙️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Context API
* Font Awesome

## Backend

* Node.js
* Express.js
* JWT Authentication
* Node-Cron (automation tasks)

## Database

* MongoDB
* Mongoose ODM

## Notifications

* WhatsApp Web Links (`wa.me`)

---

# 🔋 Features

## 🔐 Multi-Role Authentication

Secure login system using **JWT tokens** supporting three roles:

* Admin
* Farmer
* Buyer

Each role has different permissions and dashboards.

---

## 💰 Transaction Management

Two types of transactions are supported.

### Direct Purchase

```
Farmer → Buyer
Commission: 0%
```

### Resale Transaction

```
Farmer → Seller → Buyer
Commission: 5% from farmer
```

---

## 📊 Automated Pricing System

Admin can set **daily market price**.

The system automatically:

* updates pending transactions
* calculates commission
* generates settlement reports

---

## 📩 WhatsApp Notifications

Automatic **Telugu WhatsApp notifications** are sent to:

* farmers
* buyers
* sellers

Messages include:

* price fixed notifications
* pending price alerts
* settlement details

---

## ⚖ Weight Input System

Supports:

* manual weight entry
* auto-scale simulation
* stability detection for accurate weight

---

## 🗃 Data Archival System

To maintain database performance:

* transactions older than **10 days are archived**
* system allows **24-hour restore window**

---

## 📊 Real-Time Dashboard

Admin dashboard shows:

* daily transactions
* farmer-wise reports
* pending settlements
* commission statistics

---

## 🌐 Multi-Language Support

User interface supports:

* Telugu (primary)
* Hindi
* English

---

# 🔄 Project Workflow

1. Farmer brings flowers to market
2. Weight of flowers is recorded
3. Transaction is created in the system
4. Admin fixes market price later
5. System automatically calculates commission
6. WhatsApp notifications are sent
7. Settlement reports are generated

---

# 🤸 Quick Start

## 1️⃣ Clone Repository

```
git clone https://github.com/mohanmalepati135/Flower-Market-Management-System.git
cd Flower-Market-Management-System
```

---

## 2️⃣ Install Dependencies

Backend

```
cd server
npm install
```

Frontend

```
cd client
npm install
```

---

## 3️⃣ Run Application

Start backend server

```
npm start
```

Start frontend

```
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server folder**.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---



# 🚀 Future Improvements

Possible upgrades:


* AI-based flower price prediction
* Digital payments (Razorpay / UPI)
* Mobile application (React Native)
* Advanced analytics dashboard

---

# 👨‍💻 Author

**Sreenivasa Mohan Malepati**

GitHub
https://github.com/mohanmalepati135

LinkedIn
https://www.linkedin.com/in/mohanmalepati/

---

# ⭐ Support

If you find this project useful, please consider giving it a **⭐ on GitHub**.

---
