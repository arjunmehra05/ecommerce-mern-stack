# MERN E-commerce Application

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, product management, shopping cart functionality, and an admin panel.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Express.js](https://img.shields.io/badge/Express.js-4.18+-yellow)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Features

### **Customer Features**
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 👤 **User Profile Management** - Update personal information and change passwords
- 🛍️ **Product Browsing** - Browse products with category filtering and search
- 🔍 **Product Details** - Detailed product views with images and specifications
- 🛒 **Shopping Cart** - Add, remove, and manage cart items with quantity control
- 📱 **Responsive Design** - Mobile-friendly interface that works on all devices

### **Admin Features**
- ⚙️ **Admin Dashboard** - Comprehensive admin control panel
- 📦 **Product Management** - Add, edit, delete, and manage product inventory
- 👥 **User Management** - View and manage registered users
- 📊 **Order Management** - Track and manage customer orders
- 🖼️ **Image Upload** - Upload and manage product images

### **Technical Features**
- 🔒 **Secure Authentication** - Password hashing with bcrypt and JWT tokens
- 🗃️ **MongoDB Atlas** - Cloud database with proper data modeling
- 🎨 **Modern UI** - Clean, intuitive user interface with smooth animations
- 📊 **State Management** - Redux Toolkit for efficient state management
- 🔄 **Real-time Updates** - Dynamic cart updates and inventory management
- 🛡️ **Error Handling** - Comprehensive error handling and validation

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - User interface library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Styling with modern CSS features

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware

### **Database**
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Mongoose** - MongoDB object modeling for Node.js

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### **Installation**

1. **Clone the repository:**
git clone https://github.com/arjunmehra05/ecommerce-mern-stack.git
cd ecommerce-mern

2. **Install backend dependencies:**
cd backend
npm install

3. **Install frontend dependencies:**
cd ../frontend
npm install

4. **Set up environment variables:**

Create a `.env` file in the `backend` directory:
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

5. **Start the development servers:**

**Backend** (Terminal 1):
cd backend
npm run dev

**Frontend** (Terminal 2):
cd frontend
npm start


6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### **MongoDB Atlas Setup**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access (username/password)
4. Configure network access (whitelist IP addresses)
5. Get your connection string and update the `MONGODB_URI` in `.env`

### **Admin User Setup**
To create an admin user, you can either:
1. Register a regular user and manually change the role in the database
2. Use the admin creation script (if available)

## 📊 API Endpoints

### **Authentication Routes**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### **Product Routes**
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### **Admin Routes**
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

## 🔐 Environment Variables

Create a `.env` file in the backend directory with the following variables:


## 🚀 Deployment

### **Render Deployment**
1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Deploy backend as a Web Service
4. Deploy frontend as a Static Site
5. Configure environment variables in Render dashboard

### **Environment Variables for Production**
- Set `NODE_ENV=production`
- Update `CLIENT_URL` to your frontend URL
- Ensure `MONGODB_URI` points to your production database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@arjunmehra05](https://github.com/arjunmehra05)
- Email: arjunmehra2005@gmail.com

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- Render for deployment platform
- React community for excellent documentation
- Express.js team for the robust framework
- All open-source contributors who made this project possible

**Happy Coding! 🎉**

