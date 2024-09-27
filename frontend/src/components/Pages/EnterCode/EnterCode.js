import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "../../redux/actions/studentActions";
import './EnterCode.css';
import { getClassInfoByCode, addClassCode } from "../../../connector";

const EnterCode = () => {
    const [codeInput, setCodeInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("Don't have code?");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        setCodeInput(event.target.value);
    };

    const studentInfo = useSelector((state) => state.studentData);

    const handleSubmit = () => {
        if (codeInput.length < 2) {
            setErrorMessage("Code must be at least 2 characters long");
        } else if (!/^\d+$/.test(codeInput)) {
            setErrorMessage("Code must contain only numeric characters");
        } else {
            checkCodeExist(codeInput);
        }
    };

    const checkCodeExist = async (codeInput) => {
        try {
            const data = await getClassInfoByCode(codeInput);
            if (data && data.code === codeInput) {
                await addClassCode(studentInfo.email, codeInput);
                const updatedClassCodes = [...studentInfo.classCodes, codeInput];
                const updatedStudentInfo = { ...studentInfo, classCodes: updatedClassCodes };
                dispatch(setStudentInfo(updatedStudentInfo)); 
                navigate("/SelectClass", { state: { updatedStudentInfo } });
            } else {
                setErrorMessage("The code does not exist");
            }
        } catch (error) {
            setErrorMessage("There was an error processing your request");
        }
    };

    const handleNext = () => {
        if (studentInfo.classCodes && studentInfo.classCodes.length > 0) {
            navigate("/SelectClass", { state: { studentInfo } }); 
        } else {
            setErrorMessage("No class codes found in your account. Please enter a new code.");
        }
    };

    return (
        <div className="body">
            <div className="enterCodeContainer">
                <h1 className="enterCodeTitle">Enter Class Code</h1>
                <input
                    className="input-field"
                    type="text"
                    value={codeInput}
                    onChange={handleInputChange}
                    placeholder="Code"
                />
                <div className="error">
                    {errorMessage && <i>{errorMessage}</i>}
                </div>
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>

            <div className="enter-btnContainer">
                <button className="enter-confirmBtn" onClick={handleNext}>Confirm</button>
            </div>
        </div>
    );
};

export default EnterCode;
