# JID-4121_Georgia Tech LMC Film Equipment Inventory System 
<!-- technology tools and platforms used, feature implemented for this version 0.0.0, including the rationale for selecting it, bugs fixed, and known issues. See the details in assignment description. -->

**Project Overview**

This project was developed for the School of Literature, Media, and Communication at Georgia Tech. It is a **film equipment inventory system** that enables students to reserve equipment and complete payments online. Additionally, professors can manage the inventory as administrators.

**Highlight Features**

**Class-Specific Equipment Access**

The system allows professors to create class codes, limiting students to the specific equipment or packages required for their course. After logging in with their GT email and entering the class code, students can view and reserve the relevant equipment.

**Pre-Configured Equipment Packages**

Professors can create customized equipment packages for their classes, allowing students to reserve multiple items at once without individually searching the entire database. These packages simplify the reservation process, and students receive a discount at checkout when selecting a pre-configured package.

These features simplify the reservation process, ensuring streamlined equipment management for both students and administrators.

Our project is built on the MERN stack, which stands for MongoDB, Express.js, React.js, and Node.js. This architecture allows for seamless integration between the frontend and backend components, providing a robust and scalable foundation for our application. 

# Release Notes

## Version 0.1.0

### New Features
- For this release, users can now enter a class code, select a class section, choose a reservation time, and add or remove necessary equipment, all seamlessly integrated into a shopping cart and checkout process.
- For this release, users can now make payments via PayPal and will receive a barcode and confirmation email upon completion.

### Known Issues
- Equipments in the shopping cart need to be saved when user want to go back to make some changes.
- The styling need to be unified.
- The logic for passing data between pages need to be update with React Redux.
- The bar code need to be fixed and store in the db.
- The email sender system needs to verify that the payment has been successfully completed before sending the email.





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
