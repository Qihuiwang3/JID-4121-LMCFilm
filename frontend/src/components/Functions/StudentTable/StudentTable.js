import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents, deleteStudent, updateStudentRole, } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import EditButton from '../../Button/EditButton/EditButton'; 
import RoleDropdown from '../../Dropdown/RoleDropdown/RoleDropdown'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './StudentTable.css';

class StudentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filteredRecords: [],
            tempDeletedRows: [],
            updatedRoles: {},
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: ''
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const students = await getStudents();

            const flattenedRecords = students.flatMap(student => 
                student.classCodes.length > 0 
                    ? student.classCodes.map(classCode => ({
                        email: student.email,
                        name: student.name,
                        classCode: classCode,
                        role: student.role
                    }))
                    : [{ 
                        email: student.email,
                        name: student.name,
                        classCode: "N/A", 
                        role: student.role
                    }]
            );
            
            this.setState({ 
                records: flattenedRecords,
                filteredRecords: flattenedRecords, 
                tempDeletedRows: [],
                updatedRoles: {} 
            });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    tempDeleteRow = (data) => {
        this.setState((prevState) => {
            const updatedRecords = prevState.records.filter(record => record.email !== data.email); 
            const updatedFilteredRecords = prevState.filteredRecords.filter(record => record.email !== data.email); 

            return {
                records: updatedRecords,
                filteredRecords: updatedFilteredRecords, 
                tempDeletedRows: [...prevState.tempDeletedRows, data.email] 
            };
        });
    };

    confirmDeleteRows = async () => {
        try {
            const { tempDeletedRows } = this.state;
            for (let email of tempDeletedRows) {
                await deleteStudent(email); 
            }
            this.setState({ tempDeletedRows: [] });
        } catch (error) {
            console.error("Error saving deletions:", error);
        }
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.name.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
    };

    handleRoleChange = (email, newRole) => {
        this.setState(prevState => ({
            updatedRoles: {
                ...prevState.updatedRoles,
                [email]: newRole
            }
        }));
    };

    saveChanges = async () => {
        try {
            const { updatedRoles } = this.state;
            for (let [email, role] of Object.entries(updatedRoles)) {
                await updateStudentRole(email, role);
            }
            await this.confirmDeleteRows();
            this.setState({ updatedRoles: {} });
            this.loadRecords();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { gap: isEditMode ? '40%' : '33.5%' };

        const columnDefs = [
            { headerName: "Class", field: "classCode", flex: 1 },
            { headerName: "Name", field: "name", flex: 1 },
            { headerName: "Email", field: "email", flex: 1 },
            {
                headerName: "Role",
                field: "role",
                flex: 1,
                cellEditor: isEditMode ? RoleDropdown : null,
                editable: isEditMode,
                cellRenderer: params => {
                    if (isEditMode) {
                        return (
                            <RoleDropdown
                                value={params.value}
                                node={params.node}
                                colDef={params.colDef}
                                onChange={event => this.handleRoleChange(params.data.email, event.target.value)}
                            />
                        );
                    }
                    return params.value;
                }
            },
            isEditMode ? {
                headerName: "Delete",
                field: "delete",
                flex: 1,
                cellRenderer: params => {
                    return (
                        <button 
                            onClick={() => this.tempDeleteRow(params.data)} 
                            className="trash-icon"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    );
                }
            } : null
        ].filter(Boolean);

        return (
            <>
                <div className="student-title">
                    <h2>Students</h2>
                </div>
                <div className="search-bar-edit-container" style={containerStyles}>
                    <div className="student-searchbar" >
                        <SearchBar onSearch={this.handleSearch} />
                    </div>
                    <div className="student-edit">
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.filteredRecords} 
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
