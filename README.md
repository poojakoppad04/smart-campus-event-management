# Smart Campus Event Management System

A web-based platform designed to simplify and streamline the management of campus events. The system provides a centralized environment where students can discover events, register for activities, and share feedback, while organizers can create events, manage registrations, and monitor event activities.

**Project Type:** DBMS Mini Project

---

## 1. Introduction

Colleges and universities conduct various technical, cultural, academic, and extracurricular events throughout the academic year. Managing these events manually can lead to difficulties in maintaining event information, handling student registrations, tracking available seats, and collecting feedback.

The Smart Campus Event Management System addresses these challenges by providing a centralized digital platform for campus event management.

The application connects students and event organizers through a common system, making event discovery, registration, organization, and feedback management easier and more efficient.

## 2. Problem Statement

Traditional campus event management often involves manual registration processes, scattered event announcements, and separate methods of maintaining participant information.

These processes can result in:
- Difficulty accessing updated event information.
- Time-consuming registration management.
- Challenges in tracking participant details.
- Difficulty monitoring event capacity.
- Limited centralized feedback collection.
- Additional effort for organizers to manage multiple events.

The proposed system aims to reduce these difficulties through an integrated web application supported by database management.

## 3. Project Objectives

- Develop a centralized platform for campus event management.
- Provide separate functionality for students and organizers.
- Make event discovery and registration convenient.
- Enable organizers to create, update, and manage events.
- Maintain student registration and event information systematically.
- Provide feedback and rating functionality.
- Apply database management concepts to real-world application workflows.
- Improve the efficiency and accessibility of campus event operations.

## 4. Main Features

### 4.1 User Authentication
- User registration and login.
- Separate Student and Organizer roles.
- JWT-based authentication.
- Role-based access to protected operations.

### 4.2 Student Module
- Access the student dashboard.
- Browse available campus events.
- View individual event details.
- Register for campus events.
- View registration information.
- Submit event ratings and feedback.

### 4.3 Organizer Module
- Access the organizer dashboard.
- Create campus events.
- View events created by the organizer.
- Edit event information.
- Delete eligible events.
- Monitor event statistics.
- View student registration details.
- Monitor feedback statistics.

### 4.4 Event Management
- Maintain event titles and descriptions.
- Store event dates and timings.
- Maintain venue information.
- Associate events with organizers.
- Track event capacity.
- Display event information to students.

### 4.5 Registration Management
- Maintain student-event registration records.
- Associate registrations with students and events.
- Track registration status.
- Retrieve registration details for organizers.
- Support event capacity validation.

### 4.6 Feedback Management
- Allow students to submit ratings and comments.
- Associate feedback with the corresponding event and student.
- Store feedback in the database.
- Provide feedback statistics for organizers.

### 4.7 Activity Logging
- Integrate MongoDB for application activity logging.
- Record selected application activities separately from the primary relational data.

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, Express.js |
| Relational Database | MySQL |
| Activity Logging | MongoDB |
| Authentication | JSON Web Tokens (JWT) |
| API Communication | REST APIs |
| Styling | CSS |
| Version Control | Git and GitHub |

## 6. System Architecture

The application follows a client-server architecture.

### Frontend
The frontend provides the user interface through which students and organizers interact with the application. It communicates with the backend using API requests.

### Backend
The backend is developed using Node.js and Express.js. It handles authentication, authorization, event operations, registrations, feedback, and communication with the databases.

### MySQL Database
MySQL stores the application's structured relational data, including student details, organizer details, venues, events, registrations, and feedback.

### MongoDB
MongoDB is integrated to support activity logging for selected application operations.

### Application Flow

1. Students and organizers access the web application.
2. Users authenticate through the login system.
3. The frontend sends requests to the backend APIs.
4. The backend validates requests and performs the required operations.
5. Structured application data is stored or retrieved using MySQL.
6. Selected activity information is recorded using MongoDB.
7. The backend returns responses to the frontend.
8. The frontend displays the resulting information to the user.

## 7. Database Design

The relational database contains the following main entities:

| Table | Purpose |
|---|---|
| STUDENT | Stores student information |
| ORGANIZER | Stores organizer information |
| VENUE | Stores campus venue information and capacity |
| EVENT | Stores campus event details |
| REGISTRATION | Maintains student-event registrations |
| FEEDBACK | Stores event ratings and comments |

The database uses primary keys and foreign key relationships to maintain referential integrity between related records.

### Database Relationships

- An organizer can create multiple events.
- An event is associated with an organizer.
- Events are associated with venues.
- Students can register for events.
- Registration records connect students and events.
- Students can submit feedback for events.

## 8. Advanced DBMS Concepts

The project demonstrates the use of advanced SQL features.

### Views
- `vw_event_details`
- `vw_registration_details`

### Stored Functions
- `fn_event_registration_count`
- `fn_available_seats`

### Stored Procedures
- `sp_get_event_registrations`
- `sp_get_event_summary`

### Triggers
- `trg_check_registration_capacity`
- `trg_check_event_capacity_update`

These database features support reusable queries, event statistics, registration information retrieval, and capacity validation.

## 9. Project Structure

```text
smart-campus-event-management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── create-event/
│   │       ├── dashboard/
│   │       ├── events/
│   │       ├── feedback/
│   │       ├── login/
│   │       ├── organizer-dashboard/
│   │       ├── register/
│   │       └── registrations/
│   └── package.json
│
├── database_schema.sql
├── dbms_features.sql
└── README.md
```

## 10. Installation and Execution

### Prerequisites

Ensure the following software is installed:

- Node.js and npm
- MySQL Server
- MongoDB instance
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/poojakoppad04/smart-campus-event-management.git

cd smart-campus-event-management
```

### Step 2: Set Up the Database

Start the MySQL server and create the project database.

```sql
CREATE DATABASE smartcampuseventmanagement;
```

Import the database schema:

```bash
mysql -u YOUR_USERNAME -p smartcampuseventmanagement < database_schema.sql
```

Import the advanced SQL features:

```bash
mysql -u YOUR_USERNAME -p smartcampuseventmanagement < dbms_features.sql
```

Replace `YOUR_USERNAME` with your MySQL username.

### Step 3: Configure and Run the Backend

Open a terminal:

```bash
cd backend
npm install
```

Configure the required database connections, authentication secret, and environment variables in the backend `.env` file according to the backend configuration.

Start the backend using the start script configured in `backend/package.json`.

### Step 4: Configure and Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application in your browser:

http://localhost:3000

Ensure that the backend and required database services are running before testing the application.

## 11. Future Enhancements

The system can be extended with additional capabilities such as:

- Email notifications for event registrations.
- Event reminders and calendar integration.
- QR-code-based attendance tracking.
- Advanced event search and filtering.
- Event analytics and reporting.
- Waitlists for events that reach their registration capacity.
- Improved administrative management features.

## 12. Conclusion

The Smart Campus Event Management System provides an integrated solution for managing campus events through a centralized web application.

By bringing together student and organizer functionality, event management, registration handling, feedback collection, and database operations, the project demonstrates how web technologies and database management concepts can be applied to solve practical campus-level problems.

The project also provides practical experience in frontend and backend development, REST API integration, relational database design, SQL programming, authentication, and NoSQL database integration.

---

## Repository

GitHub: https://github.com/poojakoppad04/smart-campus-event-management

**Smart Campus Event Management System**  
DBMS Mini Project
