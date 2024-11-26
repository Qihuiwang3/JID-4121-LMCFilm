const nodemailer = require('nodemailer');
const USERNAME = process.env.EMAIL_USERNAME;
const PASSWORD = process.env.EMAIL_PASSWORD;

const sendEmail = (req, res) => {
    const { to, subject, html, attachments } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    
    res.status(200).send({ message: 'Processing email sending...' });

    
    setImmediate(async () => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: USERNAME,
                    pass: PASSWORD,
                },
            });

            const mailOptions = {
                from: 'Georgia Tech LMC Department <' + USERNAME + '>',
                to: to,
                subject: subject,
                html: html,
                attachments: attachments,
            };

            const info = await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    });
};

module.exports = { sendEmail };
