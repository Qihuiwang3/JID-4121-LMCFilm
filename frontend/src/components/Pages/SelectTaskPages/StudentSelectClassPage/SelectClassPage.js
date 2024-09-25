import React, { useEffect, useState } from 'react';
import './SelectClassPage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { setClassCode } from "../../../redux/actions/classActions";
import film from '../../../../Image/filmIcon.svg';

const SelectClassPage = () => {
  const [classInfo, setClassInfo] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const dispatch = useDispatch();

  const classCodeFromRedux = useSelector((state) => state.classData.classCode);

  const classCode = classCodeFromRedux;

  useEffect(() => {
    fetch(`http://localhost:3500/api/class-code/${classCode}`)
        .then((res) => res.json())
        .then((data) => {
            setClassInfo(data);
        })
        .catch((error) => {
            console.error('Error fetching class info:', error);
            setErrorMessage('Error fetching class information');
        });
  }, [classCode]);
  
  const handleConfirms = () => {
    dispatch(setClassCode(classCode));
    navigate('/Reservation', {
      state: { 
        classCode, 
      }
    });
  };

  const handleClick = (id) => {
    setSelectedClassId(id);
  };

  const handleBack = () => {
    navigate(-1); 
  };
  
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!classInfo) {
    return <div>Loading class information...</div>;
  }

  return (
    <>
      <h1 className="select-class-header">Choose Class</h1>
      <div className="grid-container">
        <div
          className="class-container"
          onClick={() => handleClick(classInfo._id)}
        >
          <div className="class-icon">
            <img className='image' src={film} alt="Class Icon" />
          </div>
          <div className={`class-info ${selectedClassId === classInfo._id ? 'selected' : ''}`}>
              <div className="class-name">{classInfo.className}</div>
              <div className="instructor-name">Instructor: {classInfo.professor}</div>
          </div>
        </div>
      </div>
      {selectedClassId && (
        <div className="btnContainer">
          <button className="backBtn" onClick={handleBack}>Back</button>
          <button className="confirmBtn" onClick={handleConfirms}>Confirm</button>
        </div>
      )}
    </>
  );
}

export default SelectClassPage;