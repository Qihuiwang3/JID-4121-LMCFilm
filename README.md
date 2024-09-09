# JID-4121 Georgia Tech LMC Film Equipment Inventory System

## Project Overview

This project is a **film equipment inventory system** developed for the School of Literature, Media, and Communication at Georgia Tech. It enables students to reserve and pay for equipment online, while professors manage inventory as administrators.

## Technology Stack

The system is built using the MERN stack (MongoDB, Express.js, React.js, Node.js), ensuring a scalable, full-stack architecture with smooth integration between the frontend and backend.


# Release Notes: 

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
