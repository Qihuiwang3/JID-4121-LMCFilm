const nodemailer = require('nodemailer');
const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;
 



const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;


    if (!to || !subject || !text) {
        return res.status(400).send({ message: 'Missing required fields' });
    }


    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${USERNAME}`,
                pass: `${PASSWORD}`
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


module.exports = { sendEmail }; 



