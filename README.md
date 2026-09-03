# FINORA - Personal Finance Manager

A modern, fully functional personal finance management application built with React, Vite, and Tailwind CSS.

## Features

- 💰 Track income and expenses
- 📊 Interactive financial charts
- 💼 Budget management
- 🎯 Savings goals tracking
- 📈 Financial analytics and insights
- 🌙 Dark mode support
- 📱 Responsive design
- 💾 Local data persistence

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   cd finora
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   └── Avatar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Budgets.jsx
│   ├── Savings.jsx
│   ├── Analytics.jsx
│   ├── Profile.jsx
│   └── Settings.jsx
├── context/
│   ├── FinanceContext.jsx
│   └── ThemeContext.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Development Phases

This project is built in phases:

1. **Phase 1**: Project setup ✅
2. **Phase 2**: Main UI/UX
3. **Phase 3**: Transaction Management
4. **Phase 4**: Finance State Management
5. **Phase 5**: Budgets
6. **Phase 6**: Savings Goals
7. **Phase 7**: Charts & Analytics
8. **Phase 8**: LocalStorage
9. **Phase 9**: Profile & Settings
10. **Phase 10**: Final UI/UX & Responsiveness
11. **Phase 11**: Full Testing

## License

MIT
