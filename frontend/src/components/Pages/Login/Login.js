import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { loginStudent, createStudent } from '../../../connector';
import { useDispatch } from 'react-redux';
import { setStudentInfo } from '../../redux/actions/studentActions';
import { loginSuccess } from '../../redux/reducers/authSlice';



const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFormSwitch = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '', name: '' });
        setErrorMessage('');
    };

    const validateInput = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

        if (!emailRegex.test(formData.email)) {
            return "Please enter a valid email address.";
        }
        if (!passwordRegex.test(formData.password)) {
            return "Password must be at least 8 characters long, contain at least one letter and one special character.";
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const validationError = validateInput();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            if (isLogin) {
                const response = await loginStudent(formData.email, formData.password);

                dispatch(setStudentInfo({
                    email: response.email,
                    name: response.name,
                    classCodes: response.classCodes,
                    role: response.role,
                }));

                dispatch(loginSuccess());

                if (response.role === 'Admin') {
                    navigate('/SelectTask');
                } else {
                    navigate('/Enter');
                }
            } else {
                const response = await createStudent({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    classCodes: [],
                });
                setIsLogin(true);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        }
    };


    return (
        <div className="login-container">
            <div className="form-container">
                <h1 className="form-title">{isLogin ? 'Login' : 'Create Account'}</h1>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {isLogin ? (
                    <>
                        <input
                            className="login-input-field"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            className="login-input-field"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                        />
                        <button className="login-submit-button" onClick={handleSubmit}>Login</button>
                        <div className="toggle-text">
                            Don't have an account?{' '}
                            <span onClick={handleFormSwitch} className="toggle-link">Create one</span>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            className="login-input-field"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            className="login-input-field"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                        />
                        <input
                            className="login-input-field"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                        <button className="login-submit-button" onClick={handleSubmit}>Create Account</button>
                        <div className="toggle-text">
                            Already have an account?{' '}
                            <span onClick={handleFormSwitch} className="toggle-link">Login here</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

}

export default Login;