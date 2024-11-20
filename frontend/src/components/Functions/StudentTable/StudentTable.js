import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
import { getStudents, deleteStudent, updateStudentRole, getStudentClassCodeByEmail, getClassInfoByCode } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import RoleDropdown from '../../Dropdown/RoleDropdown/RoleDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './StudentTable.css';
import DeletePopup from "../../Modal/DeletePopupModal/DeletePopup";
import UserClassCodeModal from "../../Modal/UserClassCodeModal/UserClassCodeModal";


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
            searchQuery: '',
            isDeletePopupOpen: false,
            selectedEmail: null,
            currentUserClassInfo: null,
            isUserClassCodeModalOpen: false,
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const students = await getStudents();

            const records = students.map(student => ({
                email: student.email,
                name: student.name,
                classCodes: student.classCodes.length > 0 ? student.classCodes : ["N/A"],
                role: student.role
            }));
    
            this.setState({
                records: records,
                filteredRecords: records,
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
        }, this.confirmDeleteRows);
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
        this.setState(prevState => {
            const updatedFilteredRecords = prevState.filteredRecords.map(record =>
                record.email === email ? { ...record, role: newRole } : record
            );
            const updatedRecords = prevState.records.map(record =>
                record.email === email ? { ...record, role: newRole } : record
            );

            return {
                updatedRoles: {
                    ...prevState.updatedRoles,
                    [email]: newRole
                },
                filteredRecords: updatedFilteredRecords,
                records: updatedRecords
            };
        }, this.saveChanges);
    };


    saveChanges = async () => {
        try {
            const { updatedRoles } = this.state;

            for (let [email, role] of Object.entries(updatedRoles)) {
                await updateStudentRole(email, role);
            }

            await this.confirmDeleteRows();

            this.setState({ updatedRoles: {} });
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    openDeletePopup = (email) => {
        this.setState({ isDeletePopupOpen: true, selectedEmail: email });
    };

    handleConfirmDelete = async () => {
        const { selectedEmail } = this.state;
        try {
            await deleteStudent(selectedEmail);
            this.setState((prevState) => {
                const updatedRecords = prevState.records.filter(record => record.email !== selectedEmail);
                const updatedFilteredRecords = prevState.filteredRecords.filter(record => record.email !== selectedEmail);
                return {
                    records: updatedRecords,
                    filteredRecords: updatedFilteredRecords,
                    isDeletePopupOpen: false,
                    selectedEmail: null
                };
            });
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    closeDeletePopup = () => {
        this.setState({ isDeletePopupOpen: false, selectedEmail: null });
    };
    
    handleViewClass = async (email) => {
        try {
            const classCodes = await getStudentClassCodeByEmail(email);
            
            const classInfoForUser = await Promise.all(
                classCodes.map(async (classCode) => {
                    const classInfo = await getClassInfoByCode(classCode)
                    return {classCode, ...classInfo}
                })
                
            )
            this.setState({ currentUserClassInfo: classInfoForUser, isUserClassCodeModalOpen: true });

        } catch (error) {
            console.error("Error fetching class information:", error);
        }
    };

    handleCloseViewClass = () => {
        this.setState({ currentUserClassInfo: null, isUserClassCodeModalOpen: false });
    };

    render() {
        const columnDefs = [
            { 
                headerName: "Class", 
                field: "classCodes", 
                flex: 1,
                cellRenderer: params => (
                    params.data.classCode === "N/A" ? (
                        <span className="no-class-code">No Class</span>
                    ) : (
                        <button 
                            onClick={() => this.handleViewClass(params.data.email)} 
                            className="view-details"
                        >
                            View Details
                        </button>
                    )
                )
            },
            { headerName: "Name", field: "name", flex: 1 },
            { headerName: "User Email", field: "email", flex: 2 },
            {
                headerName: "Role",
                field: "role",
                flex: 1,
                cellRenderer: params => (
                    <RoleDropdown
                        value={params.value}
                        node={params.node}
                        colDef={params.colDef}
                        onChange={event => this.handleRoleChange(params.data.email, event.target.value)}
                    />
                )
            },
            {
                headerName: "Delete",
                field: "delete",
                flex: 1,
                cellRenderer: params => (
                    <button
                        onClick={() => this.openDeletePopup(params.data.email)} // Open delete popup
                        className="trash-icon"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )
            }
        ];

        return (
            <>
                <div className="student-title">
                    <h2>Users</h2>
                </div>
                <div className="search-bar-edit-container">
                    <div className="student-searchbar" >
                        <SearchBar
                            onSearch={this.handleSearch}
                            placeholder={"Search by Name"}
                        />
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.filteredRecords}
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
                <DeletePopup
                    show={this.state.isDeletePopupOpen}
                    handleClose={this.closeDeletePopup}
                    handleDelete={this.handleConfirmDelete}
                />

                {this.state.isUserClassCodeModalOpen && (
                    <UserClassCodeModal
                        show={!!this.state.isUserClassCodeModalOpen}
                        userInfo={this.state.currentUserClassInfo}
                        onClose={this.handleCloseViewClass}
                    />
                )}
            </>
        );
    }
}

export default StudentTable;

