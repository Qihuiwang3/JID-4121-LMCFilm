import React from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import './Students.css';

const Students = () => {
    return (
        <div className="student-container">
            <StudentTable /> 
        </div>
    );
}

export default Students;
