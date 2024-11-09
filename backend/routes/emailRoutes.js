const express = require('express');
const { sendEmail} = require('../controllers/emailController'); // Import controller functions


const router = express.Router();


// Define the routes
router.post('/send-email', sendEmail); // Route to send an email
  // Route to save user data


module.exports = router;
