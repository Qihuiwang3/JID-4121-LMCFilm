import React, {useState} from 'react';
import './ViewEquipment.css';
import { useNavigate } from 'react-router-dom';
import film from '../../../../Image/filmIcon.svg';

const ViewEquipment = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState(null);
  
  const taskRoutes = {
    // Add routes after the corresponding page has been created
      // A: ,
      // B: ,
  };
  
  const handleConfirms = () => {
      if (selectedClassId) {
          navigate(taskRoutes[selectedClassId]);
      }
  }

  const handleClick = (id) => {
      setSelectedClassId(id);
  };

  const classes = [
      { id: 'A', name: 'Equipment'},
      { id: 'B', name: 'Damage Report'},
  ];

  return (
      <>
        <h1 className="select-class-header">Select Task</h1>
        <div className="grid-container">
          {classes.map((classItem) => (
              <div key={classItem.id}
                   className={`class-container ${selectedClassId === classItem.id ? 'selected' : ''}`} // Highlight selected
                   onClick={() => handleClick(classItem.id)}>
                <div className="class-icon">
                  <img className='image' src={film} alt="Class Icon" />
                </div>
                <div className={`class-info ${selectedClassId === classItem.id ? 'selected' : ''}`}>
                  <div className="class-name">{classItem.name}</div>
                </div>
              </div>
          ))}
        </div>
        {selectedClassId && (
            <div className="confirmBtnContainer">
                <button className="confirmBtn" onClick={handleConfirms}>Confirm</button>
            </div>
        )}
      </>
    );
}

export default ViewEquipment;