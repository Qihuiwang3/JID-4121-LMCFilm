import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './TopNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import ProfileModal from "../../Modal/ProfileModal/ProfileModal";

const TopNavBar = () => {
    const [isDroppedDown, setIsDroppedDown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();
    const studentData = useSelector((state) => state.studentData);

    const toggleDropdown = () => {
        setIsDroppedDown(!isDroppedDown);
    };

    const openProfileModal = () => {
        setShowProfileModal(true);
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const logoutNav = () => {
        navigate("/");
        setIsDroppedDown(false);
    };

    return (
        <div className="navBar">
            <div className="navBar-left">
                <div className="navTitle">LMC Film</div>
            </div>
            <div className="navBar-right">
                <div className="userIcon" onClick={toggleDropdown}>
                    <FontAwesomeIcon icon={faCircleUser} />
                </div>
                <div className="dropdownIcon">
                    <FontAwesomeIcon icon={isDroppedDown ? faAngleUp : faAngleDown} onClick={toggleDropdown} />
                    {isDroppedDown && (
                        <div className="dropdown-container">
                            <div className="dropdown-content" onClick={openProfileModal}>Profile</div>
                            <div className="dropdown-content" onClick={logoutNav}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
            <ProfileModal 
                show={showProfileModal}
                onClose={closeProfileModal}
                studentData={studentData}
            />
        </div>
    );
};

export default TopNavBar;