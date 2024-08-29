import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import './EnterCode.css';
import { collection, onSnapshot, DocumentData, addDoc } from 'firebase/firestore';
import db from "../firebase";
import PayPal from "../../Functions/PayPal/PayPal";

class EnterCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeInput: "",
            errorMessage: "Don't have code?",
            classTable: [],
            checkout: false,
        };
    }


    setCheckOut = () => {
        this.setState({ checkout: true })
    }




    render() {
        const { checkout } = this.state;
        return (
            <div className="body">
                <div className="enterCodeContainer">
                    {checkout ? (
                            <PayPal />
                        ) : (
                        <button
                            onClick={this.setCheckOut} 
                        >
                        Checkout
                        </button>
                    )}
                    <h1 className="enterCodeTitle">Enter Class Code</h1>

                    <input
                        className="input-field"
                        type="text"
                        value={this.state.codeInput}
                        onChange={this.handleInputChange}
                        placeholder="Code"
                        />
                    <div className="error">
                        {this.state.errorMessage && 
                            <i>
                                {this.state.errorMessage}
                            </i>
                        }
                    </div>
                    <button className="submit-button" onClick={this.handleSubmit}>Submit</button>
                </div>
            </div>
        );
    }
}

export default withFuncProps(EnterCode);
