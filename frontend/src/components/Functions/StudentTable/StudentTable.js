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
            // Add the 'delete' field to each record with a default value of 'Hi'
            const updatedRecords = records.map(record => ({
                ...record,
                delete: 'Hi'
            }));
            this.setState({ records: updatedRecords });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    getColumnDefs = () => {
        let baseColumnDefs = [
            { headerName: "Class", field: "classCode", flex: 1 },
            { headerName: "Name", field: "name", flex: 1 },
            { headerName: "Email", field: "email", flex: 1 },
            { headerName: "Role", field: "role", flex: 1 },
            {
                headerName: "Delete",
                field: "delete",
                flex: 1,
                hide: !this.props.isEditMode,  // Hide column when not in edit mode
                    
                cellRendererFramework: params => (
                        <button onClick={() => this.deleteRow(params.data)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    )
                
            }
        ];

        return baseColumnDefs;
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { left: isEditMode ? '0' : '' };

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
                    columnDefs={this.getColumnDefs()}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
            </>
        );
    }
}

export default StudentTable;
