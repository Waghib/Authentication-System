# MERN Authentication System

![Auth System Logo](client/src/assets/logo.svg)

A modern, secure authentication system built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🔒 **Secure Authentication**
  - JWT-based token authentication
  - Password hashing using bcrypt
  - HTTP-only cookies for token storage
  - Protected routes with middleware

- 📧 **Email Verification**
  - OTP-based email verification
  - Secure email delivery with Nodemailer
  - Account status tracking

- 🔑 **Password Management**
  - Password reset functionality
  - OTP-based reset verification
  - Secure password update

- 👤 **User Profile**
  - User data management
  - Account verification status
  - Session persistence

- 💅 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Intuitive user interface
  - Form validation
  - Toast notifications

## Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and UI components
- **Axios** - HTTP requests
- **React Context API** - State management
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context API for state management
│   │   └── pages/          # Page components
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
│
└── server/                 # Backend Node.js/Express application
    ├── config/             # Configuration files
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── .env                # Environment variables
    └── package.json        # Dependencies
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/is-auth` - Check if user is authenticated
- `POST /api/auth/send-verify-otp` - Send verification OTP
- `POST /api/auth/verify-account` - Verify account with OTP
- `POST /api/auth/send-reset-otp` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### User Routes
- `GET /api/user/data` - Get user data

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/Authentication-System.git
   cd Authentication-System
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Create `.env` file in server directory
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   SENDER_EMAIL=your_email@example.com
   ```

5. Create `.env` file in client directory
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

### Running the Application

1. Start the server
   ```bash
   cd server
   npm run dev
   ```

2. Start the client
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- OTP-based verification
- Protected API routes with middleware
- CORS configuration
- Input validation
- Error handling

## Future Enhancements

- Social login integration (Google, Facebook)
- Two-factor authentication
- Role-based access control
- Account deactivation
- Email templates
- Enhanced user profiles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/) 