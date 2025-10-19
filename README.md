# Heaven Scents | Online Perfume Store Web App

## Heaven Scents is a modern web application designed for an online perfume store.
 
Built with **Node.js**, **Express**, and **HBS**, the project follows an MVC structure that makes it scalable and easy to maintain.  
It provides a clean interface that serves both **admin** and **user** roles, offering easy navigation and a simple way to manage perfume collections.

### Additional Screens
| Signup Page | Stripe Card Payment | Order Confirmation Email |
|--------------|--------------------|---------------------------|
| ![Signup Page](./screenshots/sign_up.png) | ![Stripe Payment](./screenshots/stripe_card.png) | ![Order Email](./screenshots/email_order.png) |

| Admin Dashboard | Orders Management |
|-----------------|-------------------|
| ![Admin Dashboard](./screenshots/dashboard_admin.png) | ![Admin Orders](./screenshots/orders_admin.png) |

The principal functionalities of this project are:
 
### User Interface 
- **Login and Signup pages** with input validation and error messages for incorrect or missing information
- **Password reset via email**, allowing users to securely recover their account 
- **Personalized user sessions** that store cart items and order history after login 
- **User profile management**, enabling users to update personal information
- **Browse perfumes** and view detailed product information 
- **Search functionality** for perfumes by name or category
- **Add products to favorites**, which are stored in the user’s account in the database for future access
- **Add perfumes to cart** and view order summaries
- **Place orders** with server-side validation and informative feedback messages after form submission
- **Secure online payments** integrated through the **Stripe API** for card transactions
- **Order confirmation emails** sent automatically to users, including purchase details and delivery information
- **Product reviews system**, allowing users to leave feedback on perfumes they purchased.

### Admin Interface
- **Display key metrics** such as total revenue, number of users, and number of completed orders 
- **View recent user activity**, including who placed orders or added items to their favorites
- **View and manage orders**, including active (in-progress) and completed ones
- **Access user order history**, allowing admins to review each user’s past purchases  
- **Manage perfumes** – add, edit, or delete products from the catalog   

### Technologies Used
- **Node.js** – runtime environment  
- **Express.js** – server framework  
- **Handlebars (HBS)** – templating engine  
- **MongoDB & Mongoose** – database and ODM  
- **Stripe API** – payment integration  
- **Nodemailer** – email sending service  
- **Express-Session** – session management  
- **Multer** – file upload handling  
- **Cloudinary** – cloud image storage  
- **Bcrypt & JWT** – authentication and security  
- **Bootstrap / CSS** – responsive front-end design  
- **Dotenv** – environment variable management  

###  Installation & Setup

####  Prerequisites
Before running the project, make sure you have the following installed and configured:

- [**Node.js**](https://nodejs.org/) (v16 or later)
- [**MongoDB**](https://www.mongodb.com/) — either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [**Cloudinary**](https://cloudinary.com/) account for storing uploaded images
- A valid email account (such as Gmail) to use with **Nodemailer** for sending password reset and order confirmation emails

---

#### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/negoitaflavius26-cpu/Heaven-Scents.git
   
2. **Navigate into the project folder**
   cd Heaven-Scents

3. **Install dependencies**
   npm install

4. **Create a .env file in the root directory and add the following environment variables:**

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_KEY=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_KEY=your_stripe_secret_key

# App url
URL=http://localhost:3000

# Email (Nodemailer)
EMAIL_PASS=your_email_password_or_app_password
EMAIL_ADRESS=your_email@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Session
SESSION_SECRET=your_session_secret

---
## Note:
This project does not include the original MongoDB data or private API keys.
To use it locally, you must configure your own environment variables in the .env file.
For testing, you can create sample products manually in the database or through the admin panel.
---

5. **Run the application**

   Start the server with:
   `npm start`

 ### Admin Access Setup
To create an admin account, follow these steps:

1. Register a new user through the signup page.

2. Go to your MongoDB Atlas cluster → Database → Collections.

3. Open the modelinregistrares collection (it is automatically created after registration).

4. Find the user document you just created.

5. Change the value of the rol field from "user" to "admin".

6. Save the change — this account will now have access to the admin dashboard.

## Note: 
The necessary collections are automatically created when the app runs for the first time based on the defined Mongoose models.
You do not need to manually create them.

--

# Work in Progress
While the main features of the Heaven Scents application are fully functional, several components are still being improved or finalized:

**Password reset emails** - the system successfully resets user passwords, but currently uses a long JWT token in the reset link. Future updates will include generating a shorter, time-limited token and designing a more user-friendly email template

**Review voting system** - reviews can be created and displayed, but the upvote/downvote feature is still being optimized for dynamic updates and improved UX.

### Contact
**Negoita Andrei Flavius**  
 Email: [negoitaflavius26@gmail.com](mailto:negoitaflavius26@gmail.com)  
 GitHub: [negoitaflavius26-cpu](https://github.com/negoitaflavius26-cpu)

 ---
*This project was developed as a full-stack web application to demonstrate scalable and maintainable architecture using Node.js, Express, and MongoDB.*