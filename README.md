&lt;div align="center"&gt;
  &lt;br /&gt;
    &lt;img src="https://img.shields.io/badge/-React.JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" /&gt;
    &lt;img src="https://img.shields.io/badge/-Node.JS-black?style=for-the-badge&logoColor=white&logo=nodedotjs&color=339933" alt="node.js" /&gt;
    &lt;img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" /&gt;
    &lt;img src="https://img.shields.io/badge/-Express.JS-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="express.js" /&gt;
    &lt;img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" /&gt;
    &lt;img src="https://img.shields.io/badge/-WhatsApp-black?style=for-the-badge&logoColor=white&logo=whatsapp&color=25D366" alt="whatsapp" /&gt;
  &lt;br /&gt;

  &lt;h3 align="center"&gt;Smart Flower Market: A digital platform for flower market transactions with automated pricing and WhatsApp notifications&lt;/h3&gt;
&lt;/div&gt;

## 📋 &lt;a name="table"&gt;Table of Contents&lt;/a&gt;

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets (Code to Copy)](#snippets)
6. 🔗 [Assets](#links)
7. 🚀 [More](#more)

## &lt;a name="introduction"&gt;🤖 Introduction&lt;/a&gt;

Built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with TailwindCSS, Smart Flower Market is a comprehensive platform designed to digitize flower market operations. The platform connects farmers, buyers, and administrators with real-time transaction management, automated pricing with commission handling, and instant WhatsApp notifications in Telugu.

The system supports two transaction types: direct purchases (0% commission) and resale transactions (5% commission), with automated data archival to maintain database performance.

## &lt;a name="tech-stack"&gt;⚙️ Tech Stack&lt;/a&gt;

- **Frontend**: React.js 18, Tailwind CSS, Font Awesome
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Notifications**: WhatsApp Web (wa.me links) - Telugu only
- **Scheduling**: node-cron for automated tasks
- **State Management**: React Context API
- **HTTP Client**: Axios

## &lt;a name="features"&gt;🔋 Features&lt;/a&gt;

👉 **Multi-Role Authentication**: Secure login system for Admin, Farmer, and Buyer roles with JWT tokens

👉 **Transaction Management**: 
- Direct Purchase: Farmer → Buyer (0% commission)
- Resale: Farmer → Seller → Buyer (5% commission from farmer)

👉 **Automated Pricing System**: Set market prices and auto-apply to pending transactions with commission calculations

👉 **WhatsApp Integration**: Instant Telugu notifications to all parties with price status (fixed/pending)

👉 **Weight Input**: Auto-scale simulation with manual entry option and stability detection

👉 **Data Archival**: Automatic cleanup of 10+ day old transactions with 24-hour emergency undo window

👉 **Multi-Language UI**: Telugu (primary), Hindi, and English interface support

👉 **Real-time Dashboard**: Live statistics, farmer-wise transaction grouping, settlement reports

👉 **Responsive Design**: Fully responsive interface for desktop and mobile devices

and many more, including farmer settlement calculations, bulk price fixing, and transaction history tracking

## &lt;a name="quick-start"&gt;🤸 Quick Start&lt;/a&gt;

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (v4.4 or higher)

**Cloning the Repository**

```bash
git clone https://github.com/mohanmalepati135/Flower-Market-Management-System.git
cd Flower-Market-Management-System
