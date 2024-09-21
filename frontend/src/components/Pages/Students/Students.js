import React from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import './Students.css';

const Students = () => {
    return (
        <div className="student-container">
            <h2 className="student-title">Student</h2>
            <StudentTable /> 
        </div>
    );
}

export default Students;
