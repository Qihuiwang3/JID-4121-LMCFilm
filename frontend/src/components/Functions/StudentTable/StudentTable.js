import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 
import './StudentTable.css';

class StudentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            columnDefs: [
                { headerName: "Class", field: "classCode", flex: 1 },
                { headerName: "Name", field: "name", flex: 1 },
                { headerName: "Email", field: "email", flex: 1 },
                { headerName: "Role", field: "role", flex: 1 },
            ]
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getStudents();
            this.setState({ records });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    render() {
        return (
            <>
                <h2 className="student-title">Student</h2>
                <div className="search-bar-edit-container">
                    <div className="search-bar-position">
                        <SearchBar />
                    </div>
                    <div className="edit-btn-container">
                        <button className="edit-btn">
                            Edit
                            <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                        </button>
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.records}
                    columnDefs={this.state.columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
            </>
        );
    }
}

export default StudentTable;
