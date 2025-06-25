# Cashminder App - Codebase Structure

## 📁 Project Organization

This document outlines the clean, organized structure of the Cashminder application codebase.

### 🏗️ Root Directory Structure

```
cashminder-app/
├── 📄 README.md                    # Project documentation
├── 📄 package.json                 # Dependencies and scripts
├── 📄 package-lock.json           # Dependency lock file
├── 📄 next.config.ts              # Next.js configuration
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 eslint.config.mjs           # ESLint configuration
├── 📄 postcss.config.mjs          # PostCSS configuration
├── 📄 CODEBASE_STRUCTURE.md       # This file
├── 📁 public/                     # Static assets
├── 📁 src/                        # Source code
└── 📁 node_modules/               # Dependencies (auto-generated)
```

### 🎯 Source Code Structure (`src/`)

```
src/
├── 📁 app/                        # Next.js App Router pages
│   ├── 📄 layout.tsx             # Root layout component
│   ├── 📄 page.tsx               # Home page
│   ├── 📄 globals.css            # Global styles and fonts
│   ├── 📄 favicon.ico            # App icon
│   ├── 📁 api/                   # API routes
│   ├── 📁 auth/                  # Authentication pages
│   ├── 📁 dashboard/             # Dashboard page
│   ├── 📁 transactions/          # Transactions page
│   ├── 📁 analytics/             # Analytics page
│   ├── 📁 budgets/               # Budgets page
│   ├── 📁 goals/                 # Goals page
│   ├── 📁 settings/              # Settings page
│   ├── 📁 contact/               # Contact page
│   ├── 📁 privacy/               # Privacy policy page
│   └── 📁 terms/                 # Terms of service page
├── 📁 components/                 # Reusable React components
│   ├── 📄 ThemeWrapper.tsx       # Theme provider wrapper
│   ├── 📁 ui/                    # UI components
│   ├── 📁 layout/                # Layout components
│   ├── 📁 auth/                  # Authentication components
│   ├── 📁 dashboard/             # Dashboard-specific components
│   ├── 📁 transactions/          # Transaction components
│   ├── 📁 budgets/               # Budget components
│   ├── 📁 goals/                 # Goal components
│   └── 📁 common/                # Common/shared components
├── 📁 context/                    # React Context providers
│   └── 📄 ThemeContext.tsx       # Theme management context
├── 📁 hooks/                      # Custom React hooks
├── 📁 lib/                        # Utility libraries and helpers
│   ├── 📄 types.ts               # TypeScript type definitions
│   ├── 📄 utils.ts               # General utility functions
│   ├── 📄 mongodb.ts             # Database connection
│   ├── 📄 jwt.ts                 # JWT token utilities
│   ├── 📄 password.ts            # Password hashing utilities
│   ├── 📄 analytics.ts           # Analytics utilities
│   ├── 📄 eventBus.ts            # Event management
│   └── 📄 userSettings.ts        # User settings management
├── 📁 models/                     # Database models (Mongoose)
│   ├── 📄 User.ts                # User model
│   ├── 📄 Transaction.ts         # Transaction model
│   ├── 📄 Category.ts            # Category model
│   ├── 📄 Budget.ts              # Budget model
│   └── 📄 Goal.ts                # Goal model
└── 📄 middleware.ts               # Next.js middleware
```

## 🔧 Component Organization

### UI Components (`src/components/ui/`)
- **FuturisticThemeToggle.tsx** - Enhanced theme toggle with animations
- **BasicThemeToggle.tsx** - Simple theme toggle (legacy)
- **YesNoToggle.tsx** - Yes/No toggle component
- **ToggleSwitch.tsx** - Generic toggle switch

### Layout Components (`src/components/layout/`)
- **FuturisticNavbar.tsx** - Main navigation (enhanced)
- **Navbar.tsx** - Basic navigation (legacy)

### Feature-Specific Components
Each feature has its own directory with related components:
- `dashboard/` - Dashboard widgets and charts
- `transactions/` - Transaction forms and lists
- `budgets/` - Budget management components
- `goals/` - Goal tracking components
- `auth/` - Authentication forms

## 🎨 Styling Architecture

### Global Styles (`src/app/globals.css`)
- **Font Imports** - Futuristic fonts (Orbitron, Rajdhani, Audiowide, etc.)
- **CSS Variables** - Theme colors and design tokens
- **Utility Classes** - Custom CSS classes for futuristic effects
- **Animations** - Keyframe animations and transitions

### Design System
- **Primary Colors** - Cyan (#00C6FF) and Green (#32FF7E)
- **Typography** - Futuristic font stack with proper spacing
- **Dark/Light Mode** - Comprehensive theme support
- **Animations** - Smooth transitions and hover effects

## 🚀 Key Features

### ✅ Resolved Issues
1. **Duplicate Files Removed**
   - Removed duplicate `globals.css` from `src/styles/`
   - Renamed `ThemeToggle.tsx` to `BasicThemeToggle.tsx` for clarity

2. **Clean Directory Structure**
   - Removed unnecessary `src/styles/` directory
   - Organized components by feature
   - Clear separation of concerns

3. **Improved Naming**
   - Project renamed from `temp-project` to `cashminder-app`
   - Clear component naming conventions
   - Descriptive file and directory names

### 🎯 Design Enhancements
1. **Futuristic Typography**
   - Orbitron for headings and financial amounts
   - Rajdhani for labels and navigation
   - Audiowide for branding
   - Proper letter spacing and weights

2. **Theme System**
   - Comprehensive dark/light mode support
   - CSS custom properties for consistency
   - Smooth theme transitions

3. **Component Architecture**
   - Feature-based organization
   - Reusable UI components
   - Clear component hierarchy

## 📝 Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `FuturisticNavbar.tsx`)
- **Utilities**: camelCase (e.g., `userSettings.ts`)
- **Pages**: lowercase (e.g., `dashboard/page.tsx`)
- **Directories**: lowercase with hyphens (e.g., `components/ui/`)

### Import Organization
- External libraries first
- Internal utilities and types
- Components last
- Relative imports at the end

### Component Structure
- Props interface first
- Component function
- Export at the bottom
- Clear separation of concerns

This structure ensures maintainability, scalability, and developer experience.
