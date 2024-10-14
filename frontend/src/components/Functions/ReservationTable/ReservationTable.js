import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getStudents, deleteStudent, updateStudentRole, } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import ScanButton from '../../Button/ScanButton/ScanButton'; 
import EquipmentCheckoutPopup from '../../Modal/EquipmentCheckoutPopup/EquipmentCheckoutPopup';
import './ReservationTable.css';

class ReservationTable extends Component {
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
            showModal: false,
            showScanPopup: false
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const students = await getStudents();

            const flattenedRecords = students.flatMap(reservation => 
                reservation.classCodes.length > 0 
                    ? reservation.classCodes.map(classCode => ({
                        email: reservation.email,
                        name: reservation.name,
                        classCode: classCode,
                        role: reservation.role
                    }))
                    : [{ // If no class codes, add a record with class N/A
                        email: reservation.email,
                        name: reservation.name,
                        classCode: "N/A", 
                        role: reservation.role
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

    toggleScanModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    toggleCheckoutPopup = () => {
        this.setState(prevState => ({
            showScanPopup: !prevState.showScanPopup,
            showModal: !prevState.showModal
        }));
    };

    render() {
        const { showModal, showScanPopup } = this.state;
        const columnDefs = [
            { headerName: "Bar Code", field: "classCode", flex: 1.5 },
            { headerName: "Name", field: "name", flex: 1.5 },
            { headerName: "Email", field: "email", flex: 2 },
            { headerName: "Checked-in", field: "email", flex: 2 },
            { headerName: "Checked-out", field: "email", flex: 2 },
            { headerName: "View", field: "email", flex: 1 }

        ].filter(Boolean);

        return (
            <>
                <div className="reservation-title">
                    <h2>View Reservations</h2>
                </div>
                <div className="search-bar-edit-container">
                    <div className="reservation-searchbar" >
                        <SearchBar onSearch={this.handleSearch} />
                    </div>
                    <div className="reservation-edit">
                        <ScanButton onClick={this.toggleScanModal} />
                    </div>
                </div>
                <AgGridTable
                    rowData={this.state.filteredRecords} 
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
                {showModal && (
                    <div className="view-reservation-modal-overlay" onClick={this.toggleScanModal}>
                        <div className="view-reservation-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="view-reservation-modal-button" onClick={this.toggleCheckoutPopup}>Equipment Check Out</button>
                            <button className="view-reservation-modal-button">Equipment Check In</button>
                        </div>
                    </div>
                )}

                {showScanPopup && (
                    <EquipmentCheckoutPopup onClose={this.toggleCheckoutPopup} />
                )}
            </>
        );
    }
}

export default ReservationTable;
