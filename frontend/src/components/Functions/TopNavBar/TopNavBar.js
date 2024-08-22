import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import './TopNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';



class TopNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDroppedDown: false,
        };
    }

    toggleDropdown = () => {
        const { isDroppedDown } = this.state;
        this.setState({isDroppedDown: !isDroppedDown})
    }
    
    // profileNav = () => {
    //     this.props.navigate("/Profile");
    // }

    // notificationeNav = () => {
    //     this.props.navigate("/Notification");
    // }

    logoutNav = () => {
        // goes to EnterCode page for now
        this.props.navigate("/");
        const { isDroppedDown } = this.state;
        this.setState({isDroppedDown: !isDroppedDown})
    }



    render() {
        const { isDroppedDown } = this.state;
        return (
            <div className="navBar">
                <div className="navBar-left">
                    <div className="navTitle">LMC Film</div>
                </div>
                <div className="navBar-right">
                    <div className="userIcon" onClick={this.toggleDropdown}>
                        <FontAwesomeIcon icon={faCircleUser} />
                    </div>
                    <div className="dropdownIcon">
                        <FontAwesomeIcon icon={isDroppedDown? faAngleUp: faAngleDown} onClick={this.toggleDropdown}/>
                        {isDroppedDown && (
                            <div className="dropdown-container">
                                <div className="dropdown-content">Profile</div>
                                <div className="dropdown-content" onClick={this.logoutNav}>Logout</div>
                                <div className="dropdown-content">Notification</div>
                            </div>                        
                        )}

                    </div>
                </div>
            </div>
        );
    }
}

export default withFuncProps(TopNavBar);
