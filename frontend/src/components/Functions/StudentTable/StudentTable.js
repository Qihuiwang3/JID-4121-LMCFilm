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
            defaultColDef: {
                sortable: true,
                resizable: true
            }
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

    deleteRow = (data) => {
        console.log("Deleting row:", data);
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { left: isEditMode ? '0' : '' };

        const columnDefs = [
            { headerName: "Class", field: "classCode", flex: 1 },
            { headerName: "Name", field: "name", flex: 1 },
            { headerName: "Email", field: "email", flex: 1 },
            { headerName: "Role", field: "role", flex: 1 },
            
            isEditMode ? {
                headerName: "Delete",
                field: "delete",
                flex: 1,
                cellRenderer: params => {
                    console.log("Rendering Delete button for:", params.data);
                    return (
                        <button 
                            onClick={() => this.deleteRow(params.data)}
                            className="trash-icon"
                        >
                            <FontAwesomeIcon icon={faTrash}  />
                        </button>
                    );
                }
            } : null
        ].filter(Boolean);

        return (
            <>
                <h2 className="student-title">Students</h2>
                <div className="search-bar-edit-container" style={containerStyles}>
                    <div className="search-bar-position">
                        <SearchBar />
                    </div>
                    <div>
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.records}
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
            </>
        );
    }
}

export default StudentTable;
