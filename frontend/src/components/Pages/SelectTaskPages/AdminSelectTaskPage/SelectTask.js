import React, { useState } from 'react';
import './SelectTask.css';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import film from '../../../../Image/filmIcon.svg';

const SelectTask = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState(null);

  const location = useLocation();
  const reduxStudentInfo = useSelector(state => state.studentData);
  const studentInfo = location.state?.studentInfo || reduxStudentInfo;

  const adminTaskRoutes = {
    A: '/Enter',
    B: '/ViewEquipment',
    C: '/ViewReservation',
    D: '/Management',
  };

  const professorTaskRoutes = {
    A: '/Enter',
    B: '/ViewEquipment',
    C: '/ViewReservation'
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
    { id: 'A', name: 'Reserve Equipment' },
    { id: 'B', name: 'View Equipment' },
    { id: 'C', name: 'View Reservations' },
    { id: 'D', name: 'Management' },
  ];

  const professorClasses = [
    { id: 'A', name: 'Reserve Equipment' },
    { id: 'B', name: 'View Equipment' },
    { id: 'C', name: 'View Reservations' },
  ];

  return (
    <div className='admin-main-content'>
      <h1 className="admin-select-class-header">Select Task</h1>
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
    </div>
  );
}

export default SelectTask;