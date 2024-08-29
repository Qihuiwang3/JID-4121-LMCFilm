const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'wwilson74@gatech.edu', 
        pass: 'Bear42069!', 
    },
});

// Set up the email data
let mailOptions = {
    from: '<wwilson74@gatech.edu>', 
    to: 'wwilson74@gatech.edu', 
    subject: 'Automated Email',
    text: 'Doesnt need connect to profile emails yet?' 
    
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});

// to be used when payment is complete to have button to prompt
const handlePayment = async () => {
    try {
        const emailData = {
            to: 'get from profile',
            subject: 'Reservation Checkout',
            text: `Cart Items:`,
        };

        await axios.post('http://localhost:3500/send-email', emailData);
        alert('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email.');
    }
};