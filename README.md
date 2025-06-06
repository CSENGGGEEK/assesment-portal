# Oddiant Assessment Portal

A comprehensive, production-grade assessment portal built with Next.js 15, designed to handle 1000+ concurrent users. The platform supports both teachers and students with role-based authentication and features.

## 🚀 Features

### Authentication & Security
- **Secure Authentication**: Bcrypt password hashing with salt rounds of 12
- **Session Management**: HTTP-only cookies with automatic cleanup
- **Role-based Access**: Separate login flows for teachers and students
- **Protected Routes**: Middleware-based route protection
- **Form Validation**: Real-time validation with Zod schemas

### User Management
- **Teacher Registration**: Complete profile with professional information
- **Student Registration**: Academic details with student ID and roll number
- **Real-time Validation**: Field-level validation with visual feedback
- **Comprehensive Data**: Indian colleges and academic departments

### UI/UX
- **Dark/Light Theme**: System-aware theme switching
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Feedback**: Visual validation states
- **Accessible**: WCAG compliant components
- **Modern UI**: shadcn/ui components with Tailwind CSS

### Performance & Scalability
- **Database Optimization**: Indexed PostgreSQL tables
- **Connection Pooling**: Neon serverless database
- **Production Ready**: Built for 1000+ concurrent users
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL (Neon)
- **Authentication**: Custom session-based auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod schemas
- **Testing**: Jest + React Testing Library
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd oddiant-assessment-portal
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory:
\`\`\`env
DATABASE_URL=your_neon_database_url
\`\`\`

### 4. Database Setup
Run the SQL script to create required tables:
\`\`\`sql
-- Execute the script in scripts/01-create-tables.sql
\`\`\`

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

### Users Table
- Stores common user information for both teachers and students
- Includes authentication credentials and basic profile data

### Teachers Table
- Additional teacher-specific information
- Professional qualifications and experience

### Students Table
- Student-specific data including student ID and academic details
- Course and semester information

### Sessions Table
- Secure session management
- Automatic cleanup of expired sessions

## 🔐 Authentication Flow

### Teacher Login
- Email + Password authentication
- Professional dashboard access

### Student Login
- Student ID + Password authentication
- Academic dashboard access

### Registration
- Comprehensive form validation
- Real-time field validation
- Duplicate prevention

## 🎨 UI Components

### Form Validation
- Real-time field validation
- Visual feedback (error/success states)
- Comprehensive error messages

### Theme Support
- Light/Dark mode toggle
- System preference detection
- Persistent theme selection

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Accessible navigation

## 🧪 Testing

### Run Tests
\`\`\`bash
npm test
\`\`\`

### Watch Mode
\`\`\`bash
npm run test:watch
\`\`\`

### Coverage Report
\`\`\`bash
npm run test:coverage
\`\`\`

### Test Coverage
- Authentication functions
- Form validation hooks
- Data constants validation
- Component rendering

## 📊 Performance Considerations

### Database Optimization
- Indexed columns for fast queries
- Connection pooling for scalability
- Optimized query patterns

### Frontend Performance
- Server-side rendering
- Component lazy loading
- Optimized bundle size

### Security
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CSRF protection via same-site cookies

## 🔧 Configuration

### Environment Variables
\`\`\`env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development|production
\`\`\`

### Database Connection
The application automatically tests database connectivity on startup and ensures all required tables exist.

## 📱 Features by User Type

### Teachers
- Create and manage assessments
- View student submissions
- Generate performance reports
- Manage course enrollments

### Students
- Take assigned assessments
- View grades and feedback
- Track academic progress
- Access study materials

## 🚀 Deployment

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database URL
- Enable HTTPS for secure cookies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Future Enhancements

- Assessment creation system
- Real-time notifications
- Advanced analytics
- Mobile application
- API documentation
- Automated testing pipeline
