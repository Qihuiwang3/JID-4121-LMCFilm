# JID-4121_LMCFilm Equipment Checkin/Checkout System
<!-- technology tools and platforms used, feature implemented for this version 0.0.0, including the rationale for selecting it, bugs fixed, and known issues. See the details in assignment description. -->

This project was developed for the Georgia Tech LMC (Literature, Media, and Communication) department. It is an equipment check-in/check-out system that allows students to reserve equipment and pay online.

Admins have the ability to create class codes, which grant students access to specific equipment or equipment bundles. Using these class codes, students can reserve and check out the necessary items for their projects or classes.

The system streamlines the equipment reservation process, ensuring that both students and administrators can efficiently manage equipment availability and reservations.

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
