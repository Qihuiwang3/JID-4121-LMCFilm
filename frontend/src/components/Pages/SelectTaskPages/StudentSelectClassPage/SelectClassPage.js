import React, { useEffect, useState } from 'react';
import './SelectClassPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setClassCode } from "../../../redux/actions/classActions";
import film from '../../../../Image/filmIcon.svg';
import Button from '../../../Button/Button';
import { getClassInfoByCode, removeClassCode } from '../../../../connector';


const SelectClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const reduxStudentInfo = useSelector(state => state.studentData);
  const studentInfo = location.state?.studentInfo || reduxStudentInfo;

  useEffect(() => {
    const fetchAndValidateClasses = async () => {
      console.log(studentInfo);
      if (studentInfo && studentInfo.classCodes) {
        const uniqueClassCodes = [...new Set(studentInfo.classCodes)];
        const validClasses = [];
        const invalidClassCodes = [];

        for (const code of uniqueClassCodes) {
          try {
            const classData = await getClassInfoByCode(code);
            validClasses.push(classData);
          } catch (error) {
            if (error.response?.status === 404) {
              invalidClassCodes.push(code);
            }
          }
        }

        if (invalidClassCodes.length > 0) {
          for (const invalidCode of invalidClassCodes) {
            try {
              await removeClassCode(studentInfo.email, invalidCode);
            } catch (err) {
              console.error(`Error removing invalid class code ${invalidCode} for student:`, err);
            }
          }
        }
        setClasses(validClasses);
      } else {
        setErrorMessage('No class codes found for this student');
      }
    };
    fetchAndValidateClasses();
  }, [studentInfo]);

  const handleConfirms = () => {
    dispatch(setClassCode(selectedClassId));
    navigate('/Reservation', {
      state: {
        classCode: selectedClassId,
      }
    });
  };

  const handleClick = (id) => {
    setSelectedClassId(id);
  };

  const handleBack = () => {
    navigate('/Enter');
  };

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!classes.length) {
    return <div>Loading class information...</div>;
  }

  return (
    <div className='main-content'>
      <h1 className="select-class-header">Select Class</h1>
      <div className="grid-container">
        {classes.map(classInfo => (
          <div
            key={classInfo.code}
            className="class-container"
            onClick={() => handleClick(classInfo.code)}
          >
            <div className="class-icon">
              <img className='image' src={film} alt="Class Icon" />
            </div>
            <div className={`class-info ${selectedClassId === classInfo.code ? 'selected' : ''}`}>
              <div className="class-name">{classInfo.className}</div>
              <div className="instructor-name">Instructor: {classInfo.professor}</div>
            </div>
          </div>
        ))}
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