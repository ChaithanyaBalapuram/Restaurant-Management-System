# 🍽️ Restaurant Management System

## 🚀 Project Overview

The **Restaurant Management System** is a full-stack web application designed to streamline restaurant operations by efficiently managing orders, staff roles, kitchen workflow, and revenue analytics.

This system reduces food preparation time by enabling real-time communication between waiters, kitchen staff, and chefs, while also providing powerful insights for managers and owners.

---

## 🎯 Objectives

* Speed up order processing and food preparation
* Improve coordination between waiter, kitchen, and chef
* Track revenue, payments, and dish performance
* Provide role-based dashboards for staff

---

## 👥 User Roles & Features

### 🧑‍🍳 Waiter

* View available dishes
* View ingredients of dishes
* Place orders (table-wise)
* Cancel orders anytime
* Add compliments/feedback

---

### 👨‍🍳 Chef

* View orders by table
* See special instructions
* Update dish availability
* Monitor all active orders

---

### 🍳 Kitchen Staff

* Receive categorized orders (e.g., South Indian, Desserts)
* Update dish availability
* Manage section-based cooking

---

### 📊 Manager

* View total orders
* Track payments (Cash / Card / Online)
* View total daily revenue
* Analyze most ordered dishes

---

### 👑 Owner

* View daily, monthly, yearly revenue
* Analyze business growth
* Track staff activity
* Monitor cancelled orders
* View complaints and compliments

---

## ⚙️ Tech Stack

### 🖥️ Frontend

* React.js
* Axios
* Chart.js

### 🔙 Backend

* Java Spring Boot
* REST APIs
* WebSocket (real-time updates)

### 🗄️ Database

* MySQL

### 🔐 Security

* JWT Authentication
* Role-Based Authorization

---

## 🧱 Project Structure

```
restaurant-management-system/
│
├── backend/
│   └── Spring Boot Application
│
├── frontend/
│   └── React Application
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## 🛠️ Installation & Setup

### 🔹 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/restaurant-management-system.git
cd restaurant-management-system
```

---

### 🔹 2. Setup Database

* Open MySQL
* Run:

```
database/schema.sql
```

---

### 🔹 3. Run Backend

* Open in IntelliJ / Eclipse
* Run:

```
RestaurantApplication.java
```

---

### 🔹 4. Run Frontend

```
cd frontend
npm install
npm start
```

---

## 🔄 System Workflow

1. Waiter places order
2. Order is sent to kitchen (based on category)
3. Chef views and prepares dishes
4. Kitchen updates dish availability
5. Manager tracks payments and orders
6. Owner views analytics and reports

---

## 📊 Key Features

* ✅ Role-based login system
* ✅ Real-time order updates
* ✅ Kitchen routing system
* ✅ Dish availability tracking
* ✅ Revenue analytics dashboard
* ✅ Feedback & complaint system

---

## 🚀 Future Enhancements

* QR Code based ordering
* AI-based dish recommendation
* Inventory management system
* Mobile application support
* Online customer ordering system

---

## 💡 Learning Outcomes

* Full-stack development (Java + React)
* REST API design
* Database schema design
* Authentication & security
* Real-world system architecture

---

## 👨‍💻 Author

**Chaithanya**

---

## ⭐ Contributing

Feel free to fork this repository and improve the system.

---

## 📜 License

This project is for educational purposes.
