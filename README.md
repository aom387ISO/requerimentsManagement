# Requirements Management System

## Overview
This project is a web application designed to manage project requirements efficiently. It allows users to create, edit, and delete project requirements while maintaining an organized workflow. The system includes user authentication and different user roles to ensure proper access control.

## Features
- User authentication (admin and regular users)
- Project and requirements management
- Ability to add, edit, and delete requirements
- Dynamic visualization of project data
- REST API integration for backend communication

## Technologies Used
- **Frontend:** React.js with React Router
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **State Management:** React Hooks

## Installation and Setup
To set up the project locally, follow these steps:

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MySQL](https://www.mysql.com/) (for database management)

### Steps to Run the Project
1. **Clone the repository:**
   ```bash
   git clone https://github.com/aom387ISO/requerimentsManagement.git
   cd requerimentsManagement
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Create a new MySQL database.
   - Run the provided SQL scripts to create the necessary tables.

4. **Start the application:**
   ```bash
   npm start
   ```
   This will start both the frontend and backend servers.

## Usage
Once the application is running, navigate to `http://localhost:3000` in your browser to access the system. Log in with your credentials to manage projects and requirements.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

