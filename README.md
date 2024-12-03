# JID-4121 Georgia Tech LMC Film Equipment Inventory System

## Project Overview

This project is a **film equipment inventory system** developed for the School of Literature, Media, and Communication (LMC) at Georgia Tech. The platform allows students, professors, and staff members to reserve film equipment for projects or schoolwork seamlessly. Students can create orders to rent equipment for specific time frames, while the system includes an admin portal where administrators can manage the website. Admins can track and modify all orders, manage equipment in the database, and generate damage reports for mishandled equipment. The platform focuses on providing a streamlined, user-friendly experience tailored to the unique needs of the LMC Film Lab.

## Technology Stack

The system is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a scalable, full-stack architecture with smooth integration between the frontend and backend. Additional tools include:
1. **PayPal Integration:** For secure and seamless payment processing.
2. **React Barcode:** For efficient check-in/out processes.
3. **EmailJS:** For automated notifications and confirmations.

## Version 1.0 Release Notes

### Release Date: [12/2/2024]

### Features
 1. **Reserve Equipment:** Students can view equipment specific to their assigned classes, reserve items for a designated time frame, and complete payments seamlessly within the website using PayPal.
 2. **Barcode-Based Check-In/Out:** Administrators can efficiently manage equipment handling by scanning barcodes to check students in and out.
 3. **Equipment Management:** Administrators have full control over the database, including the ability to add, edit, view, or delete equipment as needed.
 4. **Damage Reporting System:** Administrators can log and document equipment damage, record incidents, and hide damaged items while they are under repair to prevent further reservations.
 5. **Role Management:** Administrators can assign and customize user roles, such as professors or admins, to streamline operations and ensure role-specific access.
 6. **Class Code Management:** Administrators can generate unique class codes for different classes, assigning specific equipment to each class to ensure tailored accessibility.

### Bug Fixes
1. Fixed class login code to prevent any code from being submitted.
2. Fixed the filtering of equipment into packages and single items immediately after calling equipment API.
3. Fixed students info cannot be passing in.
4. Fixed the some edge cases for cart api.
5. Fixed some UI issues.
6. Fixed functionality and UI issues with the "Add New" pop-up modal on the **Class Code** page.
7. Fixed UI issues on the **Cart** page.
8. Resolved UI consistency issues across all pages containing tables.
9. Fixed an issue where cart items were not cleared after order completion.
10. Addressed bundles-related errors on the Cart and Reservation pages caused by Bundles.map.
11. Resolved the 'fetchRecords' undefined error in the DamageTable component.
12. Resolved an inconsistency in method connections between frontend and backend for the reservation process.
    
### Known Issues
1. **GT SSO Login:** Single sign-on functionality has not yet been implemented.
2. **Class Code Page:** When creating a new package while setting up a class code, the package name occasionally does not display as expected.
3. **Cart Cache Issue:** The cart fails to clear when switching between classes, causing outdated selections to persist.
4. **PayPal Payment Errors:** No notifications are triggered when a payment fails due to issues such as network errors or incorrect credentials.

## How to Build

For detailed instructions, refer to the [Installation Guide](https://github.com/Qihuiwang3/JID-4121-LMCFilm/blob/main/installation.md#installation) on our GitHub repository.

### Frontend Setup

	1.	Ensure your local branch is up to date.
	2.	Navigate to the frontend folder: cd frontend.
	3.	Install dependencies: npm install.
	4.	Start the frontend: npm start (runs on port 3000).

### Backend Setup

	1.	Navigate to the backend folder: cd backend.
	2.	Start the backend server: npm run dev.

## Contact

For further questions or support, contact the project team at qwang491@gatech.edu.
<!-- Frontend Initial Setup -->
