import React, { useEffect, useState } from 'react';
import './SelectClassPage.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { setClassCode } from "../../../redux/actions/classActions";
import film from '../../../../Image/filmIcon.svg';
import { getClassInfoByCode } from '../../../../connector';
import Button from '../../../Button/Button';

const SelectClassPage = () => {
  const [classInfo, setClassInfo] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const dispatch = useDispatch();

  const classCodeFromRedux = useSelector((state) => state.classData.classCode);

  const classCode = classCodeFromRedux;

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const data = await getClassInfoByCode(classCode);
        setClassInfo(data);
      } catch (error) {
        setErrorMessage('Error fetching class information');
      }
    };

    fetchClassInfo();
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
    navigate('/'); 
  };
  
  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!classInfo) {
    return <div>Loading class information...</div>;
  }

  return (
    <div className='main-content'>
      <h1 className="select-class-header">Select Class</h1>
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

      <div className="btnContainer">
        <Button type="back" onClick={handleBack}>Back</Button>
        {selectedClassId && (
          <Button type="next" onClick={handleConfirms}>Next</Button>
        )}
      </div>
    </div>
  );
}

export default SelectClassPage;