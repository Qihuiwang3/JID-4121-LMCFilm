import React, { useState } from 'react';
import './SendAnnounce.css';
import { sendEmail, getStudents } from '../../../connector';





const SendAnnounce = ({ show, handleClose}) => {
    const [subject, setSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');


    const handleSendEmail = async () => {
        try {
            const students = await getStudents();
            
            
            const uniqueEmailAddresses = [...new Set(students.map(student => student.email))];
            
            
            for (const email of uniqueEmailAddresses) {
                await sendEmail({
                    to: email,
                    subject: subject,
                    html: emailBody,
                });
            }
        
            handleClose();
        } catch (error) {
            console.error('Error sending emails:', error);
            alert('Failed to send emails.');
        }
    };
        


    if (!show) {
        return null;
    }


return (


<div className="modal-overlay">
    <div className="modal-contentB">
        <div className="modal-header">
            <h2>Send Announcement</h2>
            <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="report-details">

            {/* Subject Text Box */}
            <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <input
                    type="text"
                    id="subject"
                    className="input-field"
                    placeholder="Enter the subject here"
                    value={subject} // Assuming `subject` is a state variable
                    onChange={(e) => setSubject(e.target.value)} // Assuming `setSubject` is a state setter
                />
            </div>

            {/* Email Body Text Box */}
            <div className="input-group">
                <label htmlFor="emailBody">Email Body</label>
                <textarea
                    id="emailBody"
                    className="input-field"
                    placeholder="Enter the email content here"
                    rows="4"
                    value={emailBody} // Assuming `emailBody` is a state variable
                    onChange={(e) => setEmailBody(e.target.value)} // Assuming `setEmailBody` is a state setter
                />
            </div>

        </div>
        
        <div className="modal-footer">
            <button className="cancelModal-button" onClick={handleClose}>Cancel</button>
            <button className="saveModal-button" onClick={handleSendEmail}>Send</button> {/* New send button */}
        </div>
    </div>
</div>


);


}



export default SendAnnounce;

