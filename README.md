# 🚀 Smart Inventory Management System

A robust, full-stack application designed to streamline and automate inventory management for businesses of all sizes. This system provides secure user authentication, real-time inventory tracking, cloud-based image storage, and automated email notifications. Built with Node.js, Express, PostgreSQL, and React, it offers a modern, responsive interface and scalable backend architecture.

## 📝 Project Description

The Smart Inventory Management System helps organizations efficiently manage their stock, track product movements, and optimize supply chain operations.

**Key Features:**
- 🔒 **User Authentication:** Secure login and role-based access for admins and users.
- 📦 **Inventory Management:** Add, update, and delete items; monitor stock levels and receive alerts.
- 🖼️ **Image Uploads:** Store product images securely using Cloudinary.
- 📧 **Email Notifications:** Automated alerts for low stock, new orders, and other critical events.
- 💻 **Responsive UI:** Intuitive interface for desktop and mobile users.

### 🌟 Future Enhancements

We plan to integrate advanced AI and machine learning capabilities, including:

- 📈 **Sales Prediction:** Use machine learning models to forecast future sales trends and optimize inventory levels.
- 🔢 **Logistic Regression:** Analyze historical data to predict product demand and improve supply chain decisions.
- 🤖 **AI Chatbot:** Implement a smart chatbot (powered by GPT-like models) to assist users with queries, automate support, and provide insights directly within the application.

These features will help businesses make data-driven decisions, reduce costs, and improve customer satisfaction.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React
- **Cloud Storage:** Cloudinary
- **Email Service:** Gmail SMTP

## ⚡ Getting Started

### ✅ Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL
- npm or yarn

### 📦 Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/inventory-management-system.git
   cd inventory-management-system
   ```

2. **Install dependencies:**
   - Backend:
     ```sh
     cd backend
     npm install
     ```
   - Frontend:
     ```sh
     cd ../client
     npm install
     ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the `backend` folder and fill in your credentials.
   - Example:
     ```
     PGHOST=your_postgres_host
     PGPORT=5432
     PGDATABASE=your_database
     PGUSER=your_user
     PGPASSWORD=your_password
     PGSSLMODE=disable
     PORT=4000
     NODE_ENV=development
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=24h
     CORS_ORIGIN=http://localhost:5173
     ADMIN_PASSWORD=your_admin_password

     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret

     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_email_app_password
     ```

### ▶️ Running the Application

- **Backend:**
  ```sh
  cd backend
  npm start
  ```
- **Frontend:**
  ```sh
  cd client
  npm start
  ```

Access the frontend at [http://localhost:5173](http://localhost:5173).

## 🎯 Usage

- Register or log in as an admin/user.
- Add, update, or delete inventory items.
- Upload item images (Cloudinary).
- Receive email notifications for important actions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

---

**⚠️ Note:**  
Do not commit sensitive information (like passwords or API keys) to the repository. Use `.env` files and keep them out of