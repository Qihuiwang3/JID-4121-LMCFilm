const nodemailer = require('nodemailer');
 // Import the User model (defined in another file)


// Function to send an email
const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;


    if (!to || !subject || !text) {
        return res.status(400).send({ message: 'Missing required fields' });
    }


    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'exampleEmail',
                pass: 'examplePass'
            }
        });


        const mailOptions = {
            from: 'Georgia Tech LMC Department',
            to: to,
            subject: subject,
            text: text
        };


        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send email', error });
    }
};


// Function to save user data into MongoDB




module.exports = { sendEmail }; // Export the controller functions



