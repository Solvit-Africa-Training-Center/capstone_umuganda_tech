# UmugandaTech - Community Service Platform

UmugandaTech is a comprehensive community-contribution platform that empowers local contributors through a seamless React frontend, backed by a robust Django REST API.

## 🚀 Project Overview

- **Frontend**: Modern React 19.1.1 application with TypeScript, Redux Toolkit, and Tailwind CSS
- **Backend**: Django REST API with comprehensive endpoints for user management, projects, and community features
- **Features**: Complete authentication flow, project discovery, QR code attendance, community posts, and user profiles

## ✨ Key Features

### Authentication & User Management
- **3-Step Registration**: Phone → OTP → Complete Registration
- **JWT Authentication** with automatic token refresh
- **Role-based Access**: Volunteer vs Leader permissions
- **User Profiles** with skills, badges, and certificates

### Project Management
- **Smart Discovery**: Urgent, Trending, Nearby, and Recent projects
- **Advanced Search** with filters and suggestions
- **QR Code Attendance** system for check-in/check-out
- **Project Creation** for leaders
- **Dashboard Statistics** and analytics

### Community Features
- **Community Posts** and discussions
- **Certificate Generation** for completed projects
- **Notifications** system
- **Badge System** for achievements

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** with TypeScript
- **Redux Toolkit** for state management
- **React Router DOM 7.8.2** for routing
- **Tailwind CSS 4.1.12** for styling
- **Axios 1.12.2** for HTTP requests
- **Vite 7.1.2** as build tool
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend Integration
- **Django REST Framework** endpoints
- **JWT Token Management**
- **File Upload Support**
- **Real-time Search**
- **Pagination Support**

## 📁 Project Structure

```
src/
├── api/                    # HTTP client & API endpoints
│   ├── client.ts          # Axios client with interceptors
│   ├── auth.ts           # Authentication endpoints
│   ├── projects.ts       # Project management
│   ├── users.ts          # User management
│   ├── community.ts      # Community posts
│   ├── certificates.ts   # Certificate management
│   ├── notifications.ts  # Notifications
│   └── attendance.ts     # QR code attendance
├── store/                 # Redux state management
│   ├── authSlice.ts      # Authentication state
│   ├── projectsSlice.ts  # Projects state
│   ├── communitySlice.ts # Community state
│   └── userSlice.ts      # User profile state
├── components/           # React components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── ProjectsDiscovery.tsx # Project discovery
│   ├── CommunityPosts.tsx    # Community features
│   ├── UserProfile.tsx       # User profile
│   ├── QRScanner.tsx         # QR code scanner
│   └── [other components]
├── pages/                # Route components
├── types/                # TypeScript interfaces
└── hooks/                # Custom React hooks
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Backend API running (Django REST API)

### 1. Clone the Repository
```bash
git clone https://github.com/Solvit-Africa-Training-Center/capstone_umuganda_tech.git
cd capstone_umuganda_tech
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_NODE_ENV=development
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build:prod
npm run preview
```

## 🔗 API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/users/auth/register/` - Send OTP
- `POST /api/users/auth/verify-otp/` - Verify OTP
- `POST /api/users/auth/complete-registration/` - Complete signup
- `POST /api/users/auth/login/` - User login
- `POST /api/token/refresh/` - Refresh JWT token

### Projects
- `GET /api/projects/projects/` - List projects with filters
- `GET /api/projects/projects/discover/` - Smart discovery
- `GET /api/projects/projects/search_suggestions/` - Search autocomplete
- `POST /api/projects/projects/` - Create project
- `GET /api/projects/projects/dashboard/` - Dashboard stats

### QR Code Attendance
- `POST /api/projects/projects/{id}/generate_qr_code/` - Generate QR
- `POST /api/projects/checkin/` - Check in
- `POST /api/projects/checkout/` - Check out

### Community & User Management
- `GET /api/community/posts/` - Community posts
- `GET /api/users/users/{id}/` - User profile
- `GET /api/projects/certificates/` - User certificates
- `GET /api/notifications/user-badges/` - Notifications

## 🎯 Available Routes

### Public Routes
- `/` - Landing page
- `/projects` - Project discovery (public view)
- `/community` - Community posts
- `/signin` - Sign in
- `/signup` - Sign up
- `/otp-verification` - OTP verification

### Protected Routes (Requires Authentication)
- `/dashboard` - User dashboard
- `/profile` - User profile management
- `/qr-scanner` - QR code scanner for attendance

## 🔐 Security Features

- **JWT Token Management** with automatic refresh
- **Protected Routes** based on authentication status
- **Request/Response Interceptors** for auth headers
- **Input Validation** and sanitization
- **Error Boundaries** for graceful error handling

## 📱 Features Overview

### For Volunteers
- Browse and discover community projects
- Register for projects
- QR code check-in/check-out for attendance
- View personal dashboard with statistics
- Earn badges and certificates
- Participate in community discussions

### For Leaders
- All volunteer features
- Create and manage projects
- Generate QR codes for attendance tracking
- View project analytics
- Manage project participants

## 🎨 UI/UX Features

- **Responsive Design** for all screen sizes
- **Loading States** and error handling
- **Form Validation** with real-time feedback
- **Professional Design System** with consistent colors
- **Smooth Animations** with Framer Motion
- **Accessibility Features**

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Build with production environment
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**UmugandaTech** - Empowering communities through technology 🌍