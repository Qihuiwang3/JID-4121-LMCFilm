import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getAllOrders } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import ScanButton from '../../Button/ScanButton/ScanButton'; 
import ScanPopup from '../../Modal/ScanPopup/ScanPopup.js';
import './ReservationTable.css';

class ReservationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filteredRecords: [],
            updatedRoles: {},
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: '',
            showModal: false,
            showScanPopup: false,
            viewReportId: null,
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const orders = await getAllOrders();
            console.log("orders: ", orders)
            this.setState({ 
                records: orders,
                filteredRecords: orders, 
                updatedRoles: {} 
            });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.name.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
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

    handleViewReport = (id) => {
        this.setState({ 
            viewReportId: id
        })
    };

    handleCloseModal = () => {
        this.setState({ 
            viewReportId: null
        })
    };

    render() {
        const { showModal, showScanPopup } = this.state;
        const columnDefs = [
            { headerName: "Order Number", field: "orderNumber", flex: 1.5 },
            { headerName: "Name", field: "studentName", flex: 1.5 },
            { headerName: "Email", field: "email", flex: 2 },
            { 
                headerName: "Checked-in", 
                field: "checkin", 
                flex: 2,
                valueFormatter: (params) => {
                    const dateValue = new Date(params.value);
                    return params.value ? dateValue.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).replace(',', '') : 'Available';
                }
            },
            { 
                headerName: "Checked-out", 
                field: "checkout", 
                flex: 2,
                valueFormatter: (params) => {
                    const dateValue = new Date(params.value);
                    return params.value ? dateValue.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).replace(',', '') : 'Available';
                }
            },
            { headerName: "View",
                field: "view",
                flex: 1,
                cellRenderer: params => (
                    <button onClick={() => this.handleViewReport(params.data._id)} className="reservation-view-details">
                        View Details
                    </button>
                )
            }

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
                    <ScanPopup onClose={this.toggleCheckoutPopup} />
                )}
            </>
        );
    }
}

export default ReservationTable;
