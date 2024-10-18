const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: 'weswilson2424@gmail.com',  
        pass: 'Bear42069!'    
    }
});


app.post('/api/send-email', async (req, res) => {
    const { to, subject, text } = req.body;  

    
    const mailOptions = {
        from: '"Your Name" <your-email@gmail.com>',  // Sender address
        to: to || 'weswilson2424@gmail.com',     // List of receivers (default to some email if not provided)
        subject: subject || 'Default Subject',       // Subject line
        text: text || 'This is the default email body text.', // Plain text body (use `html` for HTML emails)
    };

    try {
        let info = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
});

