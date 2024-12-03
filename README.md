# JID-4121 Georgia Tech LMC Film Equipment Inventory System

## Project Overview

This project is a **film equipment inventory system** developed for the School of Literature, Media, and Communication (LMC) at Georgia Tech. The platform allows students, professors, and staff members to reserve film equipment for projects or schoolwork seamlessly. Students can create orders to rent equipment for specific time frames, while the system includes an admin portal where administrators can manage the website. Admins can track and modify all orders, manage equipment in the database, and generate damage reports for mishandled equipment. The platform focuses on providing a streamlined, user-friendly experience tailored to the unique needs of the LMC Film Lab.

## Technology Stack

The system is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a scalable, full-stack architecture with smooth integration between the frontend and backend. Additional tools include:

	•	**PayPal Integration:** For secure and seamless payment processing.
	•	**React Barcode:** For efficient check-in/out processes.
	•	**EmailJS:** For automated notifications and confirmations.

 ## Features
 1. **Reserve Equipment:** Students can view equipment specific to their assigned classes, reserve items for a designated time frame, and complete payments seamlessly within the website using PayPal.
 2. **Barcode-Based Check-In/Out:** Administrators can efficiently manage equipment handling by scanning barcodes to check students in and out.
 3. **Equipment Management:** Administrators have full control over the database, including the ability to add, edit, view, or delete equipment as needed.
 4. **Damage Reporting System:** Administrators can log and document equipment damage, record incidents, and hide damaged items while they are under repair to prevent further reservations.
 5. **Role Management:** Administrators can assign and customize user roles, such as professors or admins, to streamline operations and ensure role-specific access.
 6. **Class Code Management: **Administrators can generate unique class codes for different classes, assigning specific equipment to each class to ensure tailored accessibility.

## Known Issues
1. **GT SSO Login:** Single sign-on functionality has not yet been implemented.
2. **Class Code Page:** When creating a new package while setting up a class code, the package name occasionally does not display as expected.
3. **Cart Cache Issue:** The cart fails to clear when switching between classes, causing outdated selections to persist.
4. **PayPal Payment Errors:** No notifications are triggered when a payment fails due to issues such as network errors or incorrect credentials.
## How to Build

For detailed instructions, refer to the Installation Guide on our GitHub repository.

# Frontend Setup

	1.	Ensure your local branch is up to date.
	2.	Navigate to the frontend folder: cd frontend.
	3.	Install dependencies: npm install.
	4.	Start the frontend: npm start (runs on port 3000).

# Backend Setup

	1.	Navigate to the backend folder: cd backend.
	2.	Start the backend server: npm run dev.

## Contact

For further questions or support, contact the project team at qwang491@gatech.edu.
<!-- Frontend Initial Setup -->
