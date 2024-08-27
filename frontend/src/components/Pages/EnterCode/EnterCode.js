import React, { Component } from "react";
import { withFuncProps } from "../../withFuncProps";
import './EnterCode.css';


class EnterCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeInput: "",
            errorMessage: "Don't have code?",
            classTable: []
        };
    }

    componentDidMount() {
        fetch('/api/class-code')
            .then(res => res.json())
            .then(data => {
                this.setState({ classTable: data });
            })
            .catch(error => console.error('Error fetching class codes:', error));
    }


    handleInputChange = (event) => {
        this.setState({ codeInput: event.target.value });
    }

    handleSubmit = () => {
        const { codeInput } = this.state;
        // Check if codeInput meets length requirements
        if (codeInput.length < 2) {
            this.setState({ errorMessage: "Code must be at least 2 characters long" });
        } 
        else if (!/^\d+$/.test(codeInput)) {
            this.setState({ errorMessage: "Code must contain only numeric characters" });
        }
        else {
            this.checkCodeExist(codeInput)
        }
    }

    checkCodeExist = (input) => {
        const codeExists = this.state.classTable.some(item => item.code === input);
        if (codeExists){
            this.props.navigate("/SelectClass");
        }
        else{
            this.setState({errorMessage: "The code does not exist" });
        }
    }

    render() {
        return (
            <div className="body">
                <div className="enterCodeContainer">
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
