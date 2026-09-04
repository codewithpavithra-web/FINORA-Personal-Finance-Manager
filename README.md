# 💰 FINORA – Personal Finance Manager

**FINORA** is a modern and user-friendly personal finance management web application designed to help users track their income, expenses, budgets, savings goals, and overall financial activity in one place.

🌐 **Live Demo:**
https://codewithpavithra-web.github.io/FINORA-Personal-Finance-Manager/

💻 **GitHub Repository:**
https://github.com/codewithpavithra-web/FINORA-Personal-Finance-Manager

---

## ✨ Features

* 💰 **Income & Expense Tracking** – Add, edit, and manage financial transactions.
* 📊 **Financial Dashboard** – Get a quick overview of your financial activity.
* 💼 **Budget Management** – Create and monitor spending budgets.
* 🎯 **Savings Goals** – Set and track personal savings goals.
* 📈 **Analytics & Charts** – Visualize financial data through interactive charts.
* 🌙 **Dark & Light Mode** – Switch between comfortable viewing themes.
* 🔍 **Search & Filtering** – Easily find and organize transactions.
* 💾 **LocalStorage Persistence** – Financial data is stored locally in the browser.
* 📱 **Responsive Design** – Works across desktop, tablet, and mobile screens.
* ⚙️ **Profile & Settings** – Manage user preferences and application settings.

---

## 🛠️ Tech Stack

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| ⚛️ React 18      | User interface                      |
| ⚡ Vite           | Development & production build tool |
| 🎨 Tailwind CSS  | Styling and responsive UI           |
| 🧭 React Router  | Client-side navigation              |
| 📊 Recharts      | Charts and data visualization       |
| 🖼️ Lucide React | Icons                               |
| 💾 LocalStorage  | Client-side data persistence        |
| 🟨 JavaScript    | Application logic                   |

---

## 📸 Application Sections

FINORA includes the following major sections:

* 🏠 Dashboard
* 💳 Transactions
* 💼 Budgets
* 🎯 Savings Goals
* 📊 Analytics
* 📄 Reports
* 👤 Profile
* ⚙️ Settings

---

## 🏗️ Project Structure

```text
FINORA-Personal-Finance-Manager/
│
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── Avatar.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Savings.jsx
│   │   ├── Analytics.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── context/
│   │   ├── FinanceContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/codewithpavithra-web/FINORA-Personal-Finance-Manager.git
```

### 2. Navigate to the Project

```bash
cd FINORA-Personal-Finance-Manager
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local development URL shown by Vite in your browser.

---

## 📦 Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 💾 Data Storage

FINORA currently uses **browser LocalStorage** for client-side data persistence.

The application stores:

* Transactions
* Budgets
* Savings Goals
* Profile information

No external database is required for the current version.

> **Note:** Because data is stored in the browser, it is specific to the browser/device where it was created.

---

## 🎯 Project Goals

The main goals of FINORA are to:

* Make personal finance tracking simple and accessible.
* Provide a clear overview of income and expenses.
* Help users plan and monitor budgets.
* Encourage consistent saving through savings goals.
* Present financial information using easy-to-understand visualizations.
* Provide a responsive and modern user experience.

---

## 🔄 Development Phases

FINORA was developed incrementally through multiple phases:

1. Project Setup
2. Main UI/UX
3. Transaction Management
4. Finance State Management
5. Budget Management
6. Savings Goals
7. Charts & Analytics
8. LocalStorage Persistence
9. Profile & Settings
10. Final UI/UX & Responsiveness
11. Testing

---

## 🌐 Live Application

### 👉 Try FINORA Online

**GitHub Pages:**
https://codewithpavithra-web.github.io/FINORA-Personal-Finance-Manager/

### 💻 Source Code

**GitHub:**
https://github.com/codewithpavithra-web/FINORA-Personal-Finance-Manager

---

## 👩‍💻 Author

**Pavithra**

Computer Science & Engineering Student

GitHub:
https://github.com/codewithpavithra-web

---

## 📄 License

This project is licensed under the **MIT License**.
