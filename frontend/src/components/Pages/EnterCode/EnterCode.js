import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setClassCode } from "../../redux/actions/classActions";
import './EnterCode.css';

const EnterCode = () => {
    const [codeInput, setCodeInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("Don't have code?");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        setCodeInput(event.target.value);
    };

    const handleSubmit = () => {
        if (codeInput.length < 2) {
            setErrorMessage("Code must be at least 2 characters long");
        } else if (!/^\d+$/.test(codeInput)) {
            setErrorMessage("Code must contain only numeric characters");
        } else {
            checkCodeExist(codeInput);
        }
    };

    const checkCodeExist = (codeInput) => {
        fetch(`http://localhost:3500/api/class-code/${codeInput}`)
            .then(res => res.json())
            .then(data => {
                if (data.code === codeInput) {
                    dispatch(setClassCode(codeInput));
                    navigate("/SelectClass");
                } else {
                    setErrorMessage("The code does not exist");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage("There was an error processing your request");
            });
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
        </div>
    );
};

export default EnterCode;
