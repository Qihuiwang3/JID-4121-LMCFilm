import React, { useState } from 'react';
import './ViewEquipment.css';
import film from '../../../../Image/filmIcon.svg';
import Button from '../../../Button/Button';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ViewEquipment = () => {
    const navigate = useNavigate();
    const [selectedClassId, setSelectedClassId] = useState(null);

    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    const adminTaskRoutes = {
        // Add routes after the corresponding page has been created
        A: '/equipment',
        B: '/DamageReport',
    };
    
    const professorTaskRoutes = {
        A: '/equipment',
    };

    const handleBack = () => {
        navigate('/SelectTask');
    };

    const handleClick = (id) => {
        setSelectedClassId(id);
        if (studentInfo.role === "Admin") {
            navigate(adminTaskRoutes[id]);
        } else {
            navigate(professorTaskRoutes[id]);
        }
    };

    const adminClasses = [
        { id: 'A', name: 'Equipment' },
        { id: 'B', name: 'Damage Report' },
    ];

    const professorClasses = [
        { id: 'A', name: 'Equipment' },
    ];

    return (
        <div className='admin-main-content'>
            <h1 className="admin-select-class-header">View Equipment</h1>
            <div className="admin-grid-container">
                {studentInfo.role === "Admin" ? 
                    adminClasses.map((classItem) => (
                        <div key={classItem.id}
                            className={`admin-class-container ${selectedClassId === classItem.id ? 'selected' : ''}`} // Highlight selected
                            onClick={() => handleClick(classItem.id)}>
                            <div className="admin-class-icon">
                                <img className='image' src={film} alt="Class Icon" />
                            </div>
                            <div className={`admin-class-info ${selectedClassId === classItem.id ? 'selected' : ''}`}>
                                <div className="admin-class-name">{classItem.name}</div>
                            </div>
                        </div>
                    ))
                    :
                    professorClasses.map((classItem) => (
                        <div key={classItem.id}
                            className={`admin-class-container ${selectedClassId === classItem.id ? 'selected' : ''}`} // Highlight selected
                            onClick={() => handleClick(classItem.id)}>
                            <div className="admin-class-icon">
                                <img className='image' src={film} alt="Class Icon" />
                            </div>
                            <div className={`admin-class-info ${selectedClassId === classItem.id ? 'selected' : ''}`}>
                                <div className="admin-class-name">{classItem.name}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={handleBack}>Back</Button>
            </div>
        </div>
    );
}

export default ViewEquipment;