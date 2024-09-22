import React from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import BackButton from '../../Button/BackButton/BackButton'; 
import './Students.css';

const Students = () => {
    return (
        <div className="student-container">
            <StudentTable /> 
            <div className="student-btn">
                <BackButton />
            </div>
        </div>
    );
}

export default Students;
