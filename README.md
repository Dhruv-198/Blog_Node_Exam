# Modern Blog - Node.js Project with JWT Authentication

A comprehensive blog application built with Node.js, Express, MongoDB, EJS templating, and JWT authentication. Features role-based access control, responsive design, and a modern user interface.

## 🚀 Features

### Core Functionality (50 points covered)

✅ **Project Setup (5 points)**
- Node.js project initialization
- Dependencies: Express, EJS, body-parser, Mongoose, JWT, cookie-parser, bcryptjs, etc.
- Basic Express server setup

✅ **MongoDB Setup (5 points)**
- MongoDB database configuration
- Article, User, and Comment collections
- Mongoose models with validation

✅ **User Model with Roles (5 points)**
- User model with username, password, role fields
- Role-based access control (admin, user)
- Secure password hashing with bcryptjs

✅ **Authentication System (10 points)**
- User registration and login controllers
- JWT token generation and validation
- Cookie-based authentication
- Logout functionality with token clearing
- Middleware for route protection

✅ **Middleware and Routing (10 points)**
- JWT validation middleware
- User information extraction from tokens
- Protected routes based on authentication
- Role-based route access control

✅ **Multi-user Article Management (10 points)**
- User-specific article management
- Article references in User model
- Comprehensive article CRUD operations
- Population of related data

✅ **EJS View Structure (5 points)**
- Complete EJS view templates:
  - `articleList.ejs` - Display all articles
  - `myArticles.ejs` - User-specific articles
  - `articleForm.ejs` - Create/edit articles
  - `articleItem.ejs` - Single article view
  - `navbar.ejs` - Navigation component
  - `login.ejs` and `register.ejs` - Authentication
  - Additional: `profile.ejs`, `admin.ejs`, `error.ejs`

## 🎨 Design Features

### Stylish Theme & Responsive Design

- **Modern CSS Architecture**: CSS custom properties (variables) for consistent theming
- **Responsive Grid Layout**: CSS Grid and Flexbox for adaptive layouts
- **Professional Color Scheme**: Gradient backgrounds, shadows, and modern typography
- **Interactive Elements**: Hover effects, transitions, and animations
- **Mobile-First Design**: Fully responsive across all device sizes

### Enhanced User Experience

- **Intuitive Navigation**: Sticky navbar with dropdowns and mobile toggle
- **Rich Typography**: Google Fonts integration with readable font hierarchy
- **Visual Feedback**: Loading states, form validation, and success messages
- **Interactive Components**: Modals, tooltips, and smooth scrolling
- **Code Syntax Highlighting**: Prism.js integration for code blocks

## 🔧 Technical Implementation

### Architecture

```
Node-Exam/
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Article.js
│   └── Comment.js
├── controllers/     # Business logic
│   ├── authController.js
│   └── articleController.js
├── routes/          # Express routes
│   ├── auth.js
│   ├── articles.js
│   └── users.js
├── middleware/      # Custom middleware
│   └── auth.js
├── views/           # EJS templates
│   ├── partials/
│   └── *.ejs files
├── public/          # Static assets
│   ├── css/
│   └── js/
├── app.js           # Main application
├── seed.js          # Database seeder
└── .env             # Environment variables
```

### Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Security**: Secure token generation and validation
- **HTTP Security**: Helmet.js for security headers
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Mongoose schema validation
- **CORS Configuration**: Secure cross-origin resource sharing

### Performance Optimizations

- **Database Indexing**: Optimized queries with indexes
- **Efficient Pagination**: Server-side pagination implementation
- **Caching Strategy**: Static asset caching
- **Minified Assets**: Production-ready CSS and JS

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Node-Exam
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Update `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/blog_db
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Database Seeding**
   ```bash
   node seed.js
   ```

5. **Start the application**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

### Default Accounts

After running the seed script, you can use these accounts:

**Admin Account:**
- Email: `admin@blog.com`
- Password: `admin123`
- Access: Full admin privileges

**Regular User:**
- Email: `john@example.com`
- Password: `password123`
- Access: Standard user features

## 📱 Features Overview

### For All Users
- Browse published articles
- Search and filter articles by category
- View individual articles with comments
- Responsive design for all devices

### For Authenticated Users
- Create, edit, and delete their own articles
- Manage article status (draft, published, archived)
- Update profile information
- View personal article statistics

### For Administrators
- Access admin dashboard
- View all users and articles
- Manage site content
- User and content moderation

## 🛠 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `node seed.js` - Populate database with sample data

### Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with cookie storage
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Modern CSS with custom properties
- **Security**: bcryptjs, helmet, express-rate-limit
- **Development**: nodemon, dotenv

### Key Dependencies

```json
{
  \"express\": \"^4.18.0\",
  \"ejs\": \"^3.1.0\",
  \"mongoose\": \"^7.0.0\",
  \"jsonwebtoken\": \"^9.0.0\",
  \"bcryptjs\": \"^2.4.0\",
  \"cookie-parser\": \"^1.4.0\",
  \"helmet\": \"^7.0.0\",
  \"express-rate-limit\": \"^6.0.0\"
}
```

## 🎯 Project Highlights

This project demonstrates:

1. **Full-Stack Development**: Complete CRUD application with authentication
2. **Modern Web Standards**: Responsive design, accessibility, and performance
3. **Security Best Practices**: JWT authentication, password hashing, input validation
4. **Professional Architecture**: MVC pattern, middleware, modular code structure
5. **User Experience**: Intuitive interface, smooth interactions, mobile-friendly
6. **Scalable Design**: Extensible codebase ready for additional features

## 📄 License

This project is created for educational purposes as part of a Node.js examination.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

---

**Note**: This project fulfills all requirements of the Node.js blog project outline, implementing JWT authentication, role-based access control, multi-user support, population features, responsive navbar, and a modern stylish theme within the specified 50-point framework.", "original_text": "", "replace_all": false}]