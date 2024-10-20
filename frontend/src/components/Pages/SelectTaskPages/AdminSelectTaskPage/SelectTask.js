import React, { useState } from 'react';
import './SelectTask.css';
import { useNavigate } from 'react-router-dom';
import film from '../../../../Image/filmIcon.svg';

const SelectTask = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState(null);

  const taskRoutes = {
    A: '/Enter',
    B: '/ViewReservation',
    C: '/ViewEquipment',
    D: '/Management',
  };

  const handleClick = (id) => {
    setSelectedClassId(id);
    navigate(taskRoutes[id]);
  };


  const classes = [
    { id: 'A', name: 'Reserve Equipment' },
    { id: 'B', name: 'View Reservations' },
    { id: 'C', name: 'View Equipment' },
    { id: 'D', name: 'Management' },
  ];

  return (
    <div className='admin-main-content'>
      <h1 className="admin-select-class-header">Select Task</h1>
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
    </div>
  );
}

export default SelectTask;