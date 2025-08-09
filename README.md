📦 Parcel Delivery API


🎥 Live Demo & Video Explanation

Live API Link: [[Deployed API Link Here](https://l2-b5-a5-pd.vercel.app)]

Video Explanation: [Loom / Google Drive Video Link Here]

📋 Table of Contents

Project Overview

✨ Features

🛠️ Technology Stack

🏗️ Project Structure

🚀 Getting Started

Prerequisites

Installation & Setup

🔐 Environment Variables

📚 API Endpoints

🛢️ Database Schema Design

📜 License

🎯 Project Overview



General Features

🔐 JWT-based Authentication: Secure stateless authentication for all users.

🎭 Role-Based Access Control (RBAC): Three distinct roles (Admin, Sender, Receiver) with specific permissions.

🔒 Password Hashing: User passwords are securely hashed using bcrypt.

🧱 Modular Architecture: Code is organized into modules (auth, user, parcel) for better scalability and maintainability.

📈 Embedded Status Tracking: Each parcel contains a complete history of its status changes as an embedded sub-document.

✅ Input Validation: All incoming data is validated using zod to ensure data integrity.


Sender Features

📦 Create Parcel: Senders can create new parcel delivery requests.

❌ Cancel Parcel: Senders can cancel a parcel if it has not yet been dispatched.

📊 View History: Senders can view a list of all parcels they have created and track their current status.


Receiver Features

📥 View Incoming Parcels: Receivers can see all parcels addressed to them.

✅ Confirm Delivery: Receivers can mark a parcel as "Delivered" upon receiving it.

📜 Delivery History: Receivers can view the history of all parcels delivered to them.


Admin Features

👥 User Management: Admins can view and manage all users in the system.

🚫 Block/Unblock Users: Admins have the authority to block or unblock any user.

parcels Parcel Management: Admins can view, update, or manage all parcels in the system.

🔄 Status Updates: Admins can manually update the status of any parcel (e.g., "Dispatched", "In Transit").


🛠️ Technology Stack
Category	Tools
⚙️ Runtime	Node.js
🔧 Framework	Express.js
🧠 Language	TypeScript
🛢️ Database	MongoDB (with Mongoose ODM)
🛡️ Security	JWT (jsonwebtoken), bcrypt, CORS
📦 Validation	Zod
⚙️ Others	dotenv, cookie-parser, http-status-codes
💅 Linter/Formatter	ESLint, Prettier
☁️ Deployment	Render / Railway
🏗️ Project Structure

The project follows a modular and scalable structure to keep the codebase clean and organized.

src/
├── app/
│   ├── modules/
│   │   ├── auth/         # Handles user login and logout block unblock 
│   │   ├── user/         # Handles user management (for admins)
│   │   └── parcel/       # Handles all parcel-related logic
│   ├── middlewares/      # Custom middlewares (auth, global error handler, etc.)
│   ├── config/           # Environment configuration
│   ├── routes/           # Combines all module routes
│   └── utils/            # Utility functions (e.g., AppError, catchAsync)
└── server.ts             # Entry point of the application


🚀 Getting Started

Follow these instructions to set up and run the project locally.

Prerequisites

Node.js (v18 or higher)

MongoDB (local instance or cloud service like MongoDB Atlas)

A code editor like VS Code



🔐 Environment Variables


📚 API Endpoints

Here is a list of the available API endpoints.

Method	Endpoint	Description	Access Control
POST	[/api/v1/auth/user/register](https://l2-b5-a5-pd.vercel.app/api/v1/user/register)	Register a new user (sender or receiver).	Public
POST	[/api/v1/auth/login](https://l2-b5-a5-pd.vercel.app/api/v1/auth/login)	Log in a user and receive a JWT token.	Public
GET	[/api/v1/user/all-users](https://l2b5a5pd.vercel.app/api/v1/user/all-users)	Get a list of all users.	Admin
PATCH	[/api/v1/user/block/userId](https://l2-b5-a5-pd.vercel.app/api/v1/user/block/userId)k	Block a user.	Admin
PATCH	[/api/v1/user/unblock/userId](https://l2-b5-a5-pd.vercel.app/api/v1/user/unblock/userId)	Unblock a user.	Admin
POST	[/api/v1/parcel/create](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/create)	Create a new parcel delivery request.	Sender
GET	[/api/v1/parcel/my-parcel](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/my-parcel)	Get all parcels created by the logged-in sender.	Sender
PATCH	[/api/v1/parcel/cancel/parcelId](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/cancel/parcelId)	Cancel a parcel created by the sender.	Sender
PATCH	/api/v1/parcels/:id/receive	Mark a parcel as received.	Receiver
GET	[/api/v1/parcel/all-parcels	](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/all-parcels) Get all parcels in the system.	Admin
GET	[/api/v1/parcel/:id](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/parcelId)	Get details of a specific parcel.	Admin
PATCH	[/api/v1/parcel/update-status/parcelId](https://l2-b5-a5-pd.vercel.app/api/v1/parcel/update-status/parcelId)	Update the status of a parcel.	Admin
GET	/api/v1/track/:trackingId	Track a parcel using its unique tracking ID.	Public (Optional)
