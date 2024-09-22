import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import EditButton from '../../Button/EditButton/EditButton'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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

    // Generate columnDefs dynamically based on edit mode
    getColumnDefs = () => {
        const { isEditMode } = this.props;
        let baseColumnDefs = [
            { headerName: "Class", field: "classCode", flex: 1 },
            { headerName: "Name", field: "name", flex: 1 },
            { headerName: "Email", field: "email", flex: 1 },
            { headerName: "Role", field: "role", flex: 1 },
        ];

        if (isEditMode) {
            baseColumnDefs.push({
                headerName: "Delete",
                field: "delete",
                flex: 0.5,
                cellRendererFramework: params => (
                    <button onClick={() => this.deleteRow(params.data)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )
            });
        }

        return baseColumnDefs;
    };

    // Function to delete a row
    deleteRow = (rowData) => {
        const updatedRecords = this.state.records.filter(record => record !== rowData);
        this.setState({ records: updatedRecords });
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;

        return (
            <>
                <h2 className="student-title">Students</h2>
                <div className="search-bar-edit-container">
                    <div className="search-bar-position">
                        <SearchBar />
                    </div>
                    <div>
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.records}
                    columnDefs={this.getColumnDefs()} // Dynamically set columnDefs
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
            </>
        );
    }
}

export default StudentTable;
