import React from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import './Students.css';

const Students = () => {
    return (
        <div>
            <h2 className="student-title">Student</h2>
            <StudentTable /> 
        </div>
    );
}

export default Students;
