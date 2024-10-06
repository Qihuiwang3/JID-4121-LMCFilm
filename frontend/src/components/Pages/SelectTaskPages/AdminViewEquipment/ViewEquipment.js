import React, { useState } from 'react';
import './ViewEquipment.css';
import { useNavigate } from 'react-router-dom';
import film from '../../../../Image/filmIcon.svg';
import Button from '../../../Button/Button';

const ViewEquipment = () => {
    const navigate = useNavigate();
    const [selectedClassId, setSelectedClassId] = useState(null);

    const taskRoutes = {
        // Add routes after the corresponding page has been created
        A: '/equipment'
        // B: ,

    };

    const handleBack = () => {
        navigate('/SelectTask');
    };

    const handleClick = (id) => {
        setSelectedClassId(id);
        navigate(taskRoutes[id]);
    };

    const classes = [
        { id: 'A', name: 'Equipment' },
        { id: 'B', name: 'Damage Report' },
    ];

    return (
        <div className='admin-main-content'>
            <h1 className="admin-select-class-header">View Equipment</h1>
            <div className="admin-grid-container">
                {classes.map((classItem) => (
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
                ))}
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={handleBack}>Back</Button>
            </div>
        </div>
    );
}

export default ViewEquipment;