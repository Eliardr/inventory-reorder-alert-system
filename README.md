Inventory Reorder Alert System

A full-stack MERN app that helps small teams track inventory, organize products by category, and keep stock levels in a healthy range. It includes secure authentication (JWT), profile management, and CRUD for Categories and Products with simple reorder heuristics (low-stock flags).

This project evolved from an earlier “Task Manager” tutorial; the codebase has been adapted to inventory concepts (Inventory, Category, Product) while keeping the same authentication, profile and CRUD foundations.

Features

Auth

Sign up, Login, Logout (JWT)

Protected routes (frontend & backend)

Profile page with prefill (name, email) and update

Inventory

Categories: create, list, update, delete

Products: create, list, update, delete

Product → Category relation (select from existing categories)

Inventory fields (currentStock, min/maxStockLevel, reorderQuantity, cost/selling price, supplier info)

Low-stock virtual flags & suggested reorder quantity

UI

Dashboard with tabs: Categories / Products

Clean form labels, validation messages, simple error banners

Quality of life

Axios instance with auth header injection

Environment-based Mongo connection

Concurrent start script to run frontend & backend together

Tech Stack

Frontend: React (CRA), React Router v6, Axios, Tailwind-ish utility classes (plain CSS ok)

Backend: Node.js, Express, Mongoose (MongoDB), JSON Web Tokens

DB: MongoDB Atlas (or local Mongo)
---

**Prerequisite:** Please install the following software and create account in following web tools** **

* **Nodejs [**[https://nodejs.org/en](https://nodejs.org/en)]** **
* **Git [**[https://git-scm.com/](https://git-scm.com/)]** **
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]** **
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]** - In tutorial, we have also showed how can you create account and database: follow step number 2.**
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]** **

---
inventory-reorder-alert-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   ├── server.js
│   └── .env (ignored)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── CategoryForm.jsx
│       │   ├── CategoryList.jsx
│       │   ├── ProductForm.jsx
│       │   └── ProductList.jsx
│       ├── context/AuthContext.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Profile.jsx
│       │   └── inventory/
│       │       ├── InventoryDashboard.jsx
│       │       ├── CategoryManager.jsx
│       │       └── ProductManager.jsx
│       ├── App.js
│       ├── RequireAuth.jsx
│       └── axiosConfig.jsx
├── package.json (root; concurrent start)
└── README.md
