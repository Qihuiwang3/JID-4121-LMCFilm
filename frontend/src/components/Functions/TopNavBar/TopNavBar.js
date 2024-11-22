import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './TopNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileModal from "../../Modal/ProfileModal/ProfileModal";
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const TopNavBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();
    const studentData = useSelector((state) => state.studentData);
    const sidebarRef = useRef(null);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openProfileModal = () => {
        setShowProfileModal(true);
        setIsSidebarOpen(false);
    };

    const toggleDropdown = () => {
        const { isDroppedDown } = this.state;
        this.setState({ isDroppedDown: !isDroppedDown })
    }

    const profileNav = () => {
        navigate("/ReservationHistory");
    }

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    const logoutNav = () => {
        localStorage.removeItem('authToken');
        navigate("/");
        setIsSidebarOpen(false);
    };

    const goToAdminSite = () => {
        navigate("/SelectTask");
        setIsSidebarOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="navBar">
            <div className="navBar-left">
                <div className="navTitle">LMC Film</div>
            </div>
            <div className="navBar-right">
                <div
                    className={`hamburgerIcon ${isSidebarOpen ? 'hamburgerIcon-shifted' : ''}`}
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
                </div>
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
                    <div className="profile-section">
                        <div className="profile-info">
                            <h3 className="student-name-bar">{studentData.name}</h3>
                        </div>
                    </div>

                    <div className="nav-links">
                        <div className="nav-link" onClick={openProfileModal}>Profile</div>
                        <div className="nav-link" onClick={profileNav}> Reservation History</div>
                        {(studentData.role === 'Admin' || studentData.role === 'SA' || studentData.role === 'Professor') && (
                            <div className="nav-link" onClick={goToAdminSite}>Admin Site</div>
                        )}
                        <div className="nav-link" onClick={logoutNav}>Logout</div>
                    </div>
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