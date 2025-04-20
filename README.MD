# 🎟️ **Ticket Management System — Class Scheduling & Booking**

🚀 **Live Link:** [Visit App](https://ticket-management-backend-27yb.onrender.com/home)


📬 **Postman API Collection:** [View Collection](https://documenter.getpostman.com/view/41543909/2sB2cd5yL5)

📁 **ER Diagram** 📄 [Download ER Diagram (PDF)](https://drive.google.com/file/d/1ugP2UQyn3MwmtCoTxnM9T_DOACGsQFsz/view?usp=sharing)



## 🔑 Key Relationships (ER Diagram Overview)

### 1. User ↔️ Booking
- **Type**: One-to-Many
- **Description**: A single user can make multiple bookings.
- **Implementation**:  
  - The `Booking` model has a `userId` field that references the `User` model.

---

### 2. Booking ↔️ Bus
- **Type**: Many-to-One
- **Description**: Each booking is associated with a specific bus.
- **Implementation**:  
  - The `busNumber` field in `Booking` maps to the `busNumber` in the `Bus` model.

---

### 3. Bus ↔️ Tickets (Embedded)
- **Type**: One-to-Many (Embedded Subdocument)
- **Description**: A bus can have multiple tickets for different time slots.
- **Implementation**:  
  - The `Bus` model contains an array of `tickets` embedded using `ticketSchema`.

---


---

### 🔄 Summary Table

| Entity A | Relationship | Entity B         | Description                                       |
|----------|--------------|------------------|---------------------------------------------------|
| User     | 1 ➝ ∞        | Booking          | A user can create multiple bookings               |
| Booking  | ∞ ➝ 1        | Bus              | Each booking is linked to a single bus            |
| Bus      | 1 ➝ ∞        | Tickets          | Each bus has multiple time-based ticket slots     |



---

## 🔑 **Roles & Access Control**

| Role     | Access Control                                           |
|----------|-----------------------------------------------------------|
| **Admin**| Full control: Create, update, delete buses, tickets, and manage user roles. |
| **User** | Book, view, and cancel ticket bookings for available buses. |


### **Role-based Access Details**

- **Admin**:
  - Full control over all resources in the system.
  - Can create, update, and delete buses and tickets.
  - Can view and manage all user bookings and roles.

- **User**:
  - Can book available tickets for buses.
  - Can cancel their own ticket bookings.
  - Cannot manage buses or tickets; limited to making bookings.


## 🛠️ **Tech Stack**

| Category          | Tools                                             |
|-------------------|---------------------------------------------------|
| **Backend**       | Node.js, Express.js                  |
| **Database**      | MongoDB, Mongoose                                 |
| **Authentication**| JWT (JSON Web Token)                              |
| **Deployment**    | Render                                          |
| **API Testing**   | Postman                                           |



## 🧩 Data Models Overview

### 👤 User Model
| Field              | Type     | Description                                      |
|-------------------|----------|--------------------------------------------------|
| name              | String   | Full name of the user                           |
| email             | String   | Unique user email (validated)                   |
| password          | String   | Hashed password (not selected in queries)       |
| role              | String   | Role of user (user/admin)                       |
| purchasedTickets  | Array    | List of purchased ticket info (bus, time, seats)|

---

### 🚌 Bus Model
| Field             | Type     | Description                                           |
|------------------|----------|-------------------------------------------------------|
| busNumber        | String   | Unique bus identifier                                 |
| busType          | String   | Type of bus (e.g., Sleeper, AC, Non-AC)               |
| capacity         | Number   | Total number of seats                                 |
| route.from       | String   | Starting point of the route                           |
| route.to         | String   | Destination point of the route                        |
| route.distanceKm | Number   | Distance in kilometers                                |
| departureTimes   | [Date]   | Available departure times                             |
| tickets          | [Object] | Ticket details for time slots                         |
| createdAt        | Date     | Bus creation timestamp                                |
| updatedAt        | Date     | Last update timestamp                                 |

---

### 🎟️ Ticket Sub-Model (Embedded in Bus)
| Field         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| timeSlot     | Date     | Scheduled departure date and time                |
| availableSeats | Number | Seats still available                            |
| soldSeats    | Number   | Seats already sold                               |
| ticketPrice  | Number   | Price per seat                                   |
| status       | String   | Status of the ticket (available/booked/cancelled)|

---

### 📝 Booking Model
| Field         | Type     | Description                              |
|--------------|----------|------------------------------------------|
| busNumber    | String   | Bus associated with the booking          |
| timeSlot     | Date     | Selected time for the journey            |
| seatsBooked  | Number   | Number of seats booked                   |
| userId       | ObjectId | Reference to the User who booked         |

---


## 🔰 API Documentation

### 🔗 API Base URL
[https://ticket-management-backend-27yb.onrender.com](https://ticket-management-backend-27yb.onrender.com/home)

---

### 🔐 Authentication Endpoints

| Method | Endpoint            | Description                   |
|--------|---------------------|-------------------------------|
| POST   | `/register`         | Register new user             |
| POST   | `/login`            | Login with email & password   |
| POST   | `/logout`           | Logout                        |

---

### 👨‍💼 Admin Routes

| Method | Endpoint                        | Description                             |
|--------|----------------------------------|-----------------------------------------|
| POST   | `/bus`                          | Create new bus                          |
| PUT    | `/bus/:id`                      | Update bus by ID                        |
| DELETE | `/bus/:id`                      | Delete bus by ID                        |
| POST   | `/ticket`                       | Create a ticket for time slot           |
| PUT    | `/ticket/:id`                   | Update a ticket                         |
| DELETE | `/ticket/:id`                   | Delete a ticket                         |

---

### 🧑‍🎓 User Routes

| Method | Endpoint             | Description                           |
|--------|----------------------|---------------------------------------|
| GET    | `/busses`            | View all available buses              |
| GET    | `/tickets`           | View available tickets                |
| POST   | `/tickets`           | Purchase a ticket                     |
| DELETE | `/tickets`           | Cancel a purchased ticket             |

---

## 🧪 Test Credentials

### 🔐 Admin
- **Email:** admin@gmail.com  
- **Password:** admin

### 👤 User
- **Email:** user@gmail.com  
- **Password:** 123456


## 🛠️ Local Setup

Follow the steps below to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/jarifMohammed/Ticket-management-backend.git
cd Ticket-management-backend

 Write proper env variables in .env

MONGO_URI=your_mongo_connection_string
PORT=your_port
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

Run server

npm run dev
