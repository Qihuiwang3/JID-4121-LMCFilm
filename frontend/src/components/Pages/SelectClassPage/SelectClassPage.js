import React, {useState} from 'react';
import './SelectClassPage.css';
import { useNavigate } from 'react-router-dom';
import film from '../../../Image/filmIcon.svg';

const SelectClassPage = () => {
    const navigate = useNavigate();
    const [selectedClassId, setSelectedClassId] = useState(null);
    
    const handleConfirms = () => {
        navigate('/Reservation');
    };

    const handleClick = (id) => {
        setSelectedClassId(id);
    };

    const classes = [
        { id: 'A', name: 'LMC 3406(A) - Film 24SP', instructor: 'John Throton' },
        { id: 'B', name: 'LMC 3406(B) - Film 24SP', instructor: 'John Throton' },
        { id: 'C', name: 'LMC 3408(A) - Film 24SP', instructor: 'John Throton' },
        { id: 'D', name: 'LMC 3408(B) - Film 24SP', instructor: 'John Throton' },
    ];

    return (
        <>
          <h1 className="select-class-header">Choose Class</h1>
          <div className="grid-container">
            {classes.map((classItem) => (
                <div key={classItem.id}
                     className="class-container"
                     onClick={() => handleClick(classItem.id)}>
                  <div className="class-icon">
                    <img className='image' src={film} alt="Class Icon" />
                  </div>
                  <div className={`class-info ${selectedClassId === classItem.id ? 'selected' : ''}`}>
                    <div className="class-name">{classItem.name}</div>
                    <div className="instructor-name">Instructor: {classItem.instructor}</div>
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

export default SelectClassPage;