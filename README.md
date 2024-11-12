# JID-4121 Georgia Tech LMC Film Equipment Inventory System

## Project Overview

This project is a **film equipment inventory system** developed for the School of Literature, Media, and Communication at Georgia Tech. It enables students to reserve and pay for equipment online, while professors manage inventory as administrators.

## Technology Stack

The system is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a scalable, full-stack architecture with smooth integration between the frontend and backend.


# Release Notes: 

## Version 0.4.0
**Release Date:** [11/11/2024]

### Overview

In this sprint, we focused on addressing critical bugs and inconsistencies identified in previous releases, improving UI/UX for a more seamless experience, and enhancing functionality for both admins and students. Key updates include improved reservation management, damage report integration, and system-wide consistency enhancements.

#### New Features

- Students can now limit time selection for reservations to only 5 days between pickup and return dates, ensuring better equipment availability management.
- Professors/TA have limitations on certain functionalities.
- Reservation History now includes the ability to cancel reservations 24 hours before the pickup time and extend reservations once for free, which provides flexibility for students.
- The “Send Announcement” button is now functional for administrators who want to send out announcements.

#### Bug Fixes

- Fixed an issue where cart items were not cleared after order completion.
- Addressed bundles-related errors on the Cart and Reservation pages caused by Bundles.map
- Resolved the 'fetchRecords' undefined error in the DamageTable component.
- Resolved an inconsistency in method connections between frontend and backend for the reservation process.

#### Known Issues
- The GT SSO Login feature has not yet been implemented on the website.
- UI inconsistencies in titles across the website require further attention.

## Version 0.3.0
**Release Date:** [10/20/2024]

### Overview

In this initial release, we focused on completing the development of the key features for the Admin Portal, which include submitting damage reports and creating interfaces where admins can view current reservations and check students in and out accordingly. Additionally, we developed an interface for both the Admin Portal and Student Portal to view reservation history, including order barcodes, damage reports, and detailed check-in and check-out dates and times for each order. We also updated the navigation bar to a side panel instead of a drop-down menu and fixed some UI bugs from the last sprint.

#### New Features

- In this release, Admins can now create a damage report if they find equipment is damaged when returned by students.
- Admins can now check students in when they pick up equipment and check them out when they return the equipment by scanning the barcode provided by the students and the barcode attached to each piece of equipment to ensure accurate tracking.
- Both Admins and Students can now view their current and past reservation history, including the order barcode, check-in and check-out dates, order details, and any associated damage reports.

#### Bug Fixes

- Fixed functionality and UI issues with the "Add New" pop-up modal on the **Class Code** page. 
- Fixed UI issues on the **Cart** page.
- Resolved UI consistency issues across all pages containing tables.

#### Known Issues
- Need to implement a method to verify successful payment before generating a barcode for each order.
- Admin: Unable to return to the main page after selecting 'Reserve Equipment.'
- Admin: No option to edit equipment name and price after it's been added to the database.
- ecurity Issue: Unable to navigate directly to other pages via URL.
- Consistency across the website. 
  
## Version 0.2.0
**Release Date:** [9/30/2024]

### Overview

In this initial release, we focused on developing key features for the **Admin Portal**.This portal allows Admins to interact with the system by editing film equipment, create class code, and view students for those who has signed up to use this website. Also, we fixed some issues in **Student protal** such as create a login system, and local storage.

#### New Features

- For this release, Admins can now create a class code, select a class section, add or remove equipment in the database and view students class deatil.
- For this release, We Update UI in Student portal.

#### Bug Fixes

- Fixed students info cannot be passing in.
- Fixed the some edge cases for cart api.
- fixed some UI issues.

#### Known Issues
- Barcodes need to be properly generated and stored in the database.
- The email sender system needs to verify successful payment before sending confirmation emails.
- If a student has multiple class, the Admin cannot view all the classes registered by this student.
  
## Version 0.1.0
**Release Date:** [9/8/2024]

### Overview

In this initial release, we focused on developing key features for the **Student Portal**. This portal allows students to interact with the system by reserving film equipment for class projects.

#### New Features

- For this release, users can now enter a class code, select a class section, choose a reservation time, and add or remove necessary equipment. These actions are seamlessly integrated into a shopping cart and checkout process.
- For this release, users can now make payments via PayPal and will receive a barcode and confirmation email upon completion.

#### Bug Fixes

- Fixed class login code to prevent any code from being submitted.
- Fixed the filtering of equipment into packages and single items immediately after calling equipment API.

#### Known Issues

- Equipment in the shopping cart is not saved when users navigate back to make changes.
- Styling needs to be unified across all pages.
- Data passing between pages needs to be updated with React Redux.
- Barcodes need to be properly generated and stored in the database.
- The email sender system needs to verify successful payment before sending confirmation emails.

# How to build
<!-- Frontend Initial Setup -->

1. make sure your local branch is up to date
2. go to the frontend folder by ```cd frontend```
3. run ```git install``` (this is to install the dependencies from liberary)
4. run ```npm start``` (this is to ONLY start the frontend in port 3000)

<!-- Frontend Update -->

1. You only need to run "npm install" to update packages. Other steps are the same from Initial Setup


<!-- Backend -->
1. got to the backend folder by ```cd backend```
2. Running command: ```npm run dev```
