E-Commerce Shopping App SAAS
Introduction

Welcome to our E-commerce platform, a complete application built using the MERN stack (MongoDB, Express, React, Node.js) and Material-UI (MUI) for the user interface. This project provides both regular user and administrator modes, offering a wide range of features designed to enhance the shopping experience.

## Stack Tecnologic

![MongoDB](https://img.shields.io/badge/-MongoDB-green) ![Express](https://img.shields.io/badge/-Express-blue) ![React](https://img.shields.io/badge/-React-blue) ![Node.js](https://img.shields.io/badge/-Node.js-green) ![Material-UI](https://img.shields.io/badge/-Material--UI-blue) ![Stripe](https://img.shields.io/badge/-Stripe-blue) ![Mongoose](https://img.shields.io/badge/-Mongoose-green) ![Redux](https://img.shields.io/badge/-Redux-purple) ![Redux-thunk](https://img.shields.io/badge/-Redux--thunk-purple) ![CSS3](https://img.shields.io/badge/-CSS3-blue)

🚀 Main Features
👤 User Management
Complete authentication system (login/registration)
Customizable user profiles with avatars (upload or random generation)
Password recovery system via email
Profile management (edit personal information, password, and avatar)
Detailed order history
Multiple shipping address management
Role-based system (Admin/User)
Role-based route protection
🛍️ Product Catalog
Product display with multiple images
Advanced filtering system
Product search
Size management for each product with dedicated stock
Detailed review and rating system
Product availability indicator
Discounted prices and "Out of Stock" badges
Product recommendation system
Sponsored product slider
Trending products section
🛒 Cart and Checkout
Persistent shopping cart
Size selection with availability verification
Dynamic quantity management
Automatic calculation of totals and discounts
Multi-step checkout process
Stripe payment integration
Order confirmation via email
Order status tracking
Ability to reorder from previous orders
👨‍💼 Admin Panel
Complete dashboard with statistics
Product management (CRUD)
Multiple image uploads
Stock management by size
Price and discount management
Category management
Size management
Custom size creation
Stock management by size
Order management
Order viewing
Status updates
Shipping management
User management
Role management
Account management
Review management
Sales analytics and reports
🎨 Site Customization
Logo and store name management
Hero slider customization
Social media link management
Customizable text content
Payment method configuration
Stripe key management
Gateway configuration
SMTP email management
Mail server configuration
Customizable email templates
WhatsApp Business integration
Contact information management
About/Info page customization
📱 Additional Features
Fully responsive design
Notification system
Customizable cookie banner
Social media integration
Informational pages (Privacy Policy, Terms and Conditions)
Stripe webhook system
Complete RESTful API
Advanced error handling
Rate limiting and security
🛠️ Installation and Configuration
1. Clone the repository:
git clone https://github.com/PixelPunkNFT/Ecommerce-react-stripe-mongoDB.git
cd Folder

2. Backend Installation:
npm install

3. Frontend Installation:
cd frontend
npm install

4. Environment Variables Configuration
Backend (.env):

Create a .env file in the backend folder with the following variables:

# Server Configuration
PORT = "5000"
NODE_ENV = "development"

# MongoDB Configuration
DB_LINK = "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"

# JWT Configuration
JWT_SECRET = "<your-jwt-secret>"
JWT_EXPIRE = "1y"
COOKIE_EXPIRE = "5"

# SMTP Configuration
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = "587"
SMTP_SECURE = "false"
SMTP_USER = "<your-email>"
SMTP_PASS = "<your-app-password>"
SMTP_FROM = "Your Name <your-email>"

# Cloudinary Configuration
CLOUDINARY_NAME = "<your-cloudinary-name>"
API_KEY = "<your-cloudinary-api-key>"
API_SECRET = "<your-cloudinary-api-secret>"
CLOUDINARY_URL = "cloudinary://<api-key>:<api-secret>@<cloudinary-name>"

# URLs
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:5000"

# Stripe Configuration
STRIPE_API_KEY = "<your-stripe-publishable-key>"
STRIPE_SECRET_KEY = "<your-stripe-secret-key>"
STRIPE_WEBHOOK_SECRET = "<your-stripe-webhook-secret>"
SUBSCRIPTION_PRICE = "<your-stripe-subscription-price-id>"

Frontend (.env.local):

Create a .env.local file in the frontend folder with the following variables:

REACT_APP_STRIPE_KEY=<your-stripe-publishable-key>
REACT_APP_API_URL=http://localhost:5000/api/v1

5. Start the Application
Backend:
cd backend
npm start

Frontend:
cd frontend
npm start


The application will be available at:

Frontend: http://localhost:3000
Backend API: http://localhost:5000
📱 Responsive Design

The application is fully optimized for:

Desktop
Tablet
Mobile devices
🔐 Security
JWT authentication
Password hashing
Protected routes
Input sanitization
CORS policy
Rate limiting
Advanced error handling
Data validation
XSS protection
Session security
🚀 Deployment on Vercel

To deploy the application on Vercel:

Prepare the project with the correct structure
Configure vercel.json in the root directory:
{
  "version": 2,
  "builds": [
    {
      "src": "./backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "./frontend/build",
      "use": "@vercel/static"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/backend/server.js"
    }
  ]
}

Build the frontend
Push the project to GitHub
Connect the repository to Vercel
Configure the environment variables
Deploy
👨‍💻 Author

Juri Moretti

📄 License

ISC
