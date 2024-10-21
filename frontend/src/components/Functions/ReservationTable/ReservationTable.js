import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import { getAllOrders, getOrderById } from '../../../connector.js';  
import SearchBar from '../SearchBar/SearchBar'; 
import ScanButton from '../../Button/ScanButton/ScanButton'; 
import ScanPopup from '../../Modal/ScanPopup/ScanPopup.js';
import ReservationDetailPopup from '../../Modal/ReservationDetailPopup/ReservationDetailPopup.js';

import './ReservationTable.css';

class ReservationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filteredRecords: [],
            reservationDetails: null, 
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: '',
            showScanPopup: false,
            showViewDetailPopup: false,
            selectedOption: '',
            viewReportId: null,
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const orders = await getAllOrders();
            this.setState({ 
                records: orders,
                filteredRecords: orders
            });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.email.toLowerCase().includes(query.toLowerCase())
        );
        
        this.setState({ filteredRecords, searchQuery: query });
    };

    toggleScanModal = () => {
        this.setState(prevState => ({
            showScanPopup: !prevState.showScanPopup,
            selectedOption: '', 
        }));
    };

    handleOptionChange = (event) => {
        this.setState({ selectedOption: event.target.value });
    };

    handleViewReport = async (id) => {
        try {
            const reservationDetails = await getOrderById(id);
            console.log("reservationDetails: ", reservationDetails)
            this.setState({
                viewReportId: id,
                reservationDetails, 
                showViewDetailPopup: true,
            });
        } catch (error) {
            console.error("Error fetching reservation details:", error);
        }
    };

    handleCloseViewDetailModal = () => {
        this.setState(prevState => ({
            showViewDetailPopup: !prevState.showViewDetailPopup,
            reservationDetails: null 
        }));
    };

    render() {
        const { showScanPopup, selectedOption, showViewDetailPopup, reservationDetails } = this.state;
        const columnDefs = [
            { headerName: "Order #", field: "orderNumber", flex: 1.5 },
            { headerName: "Name", field: "studentName", flex: 1.3 },
            { headerName: "Email", field: "email", flex: 2.3 },
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
            { 
                headerName: "View",
                field: "view",
                flex: 1,
                cellRenderer: params => (
                    <button onClick={() => this.handleViewReport(params.data._id)} className="reservation-view-details">
                        View Details
                    </button>
                )
            }
        ];

        return (
            <>
                <div className="reservation-title">
                    <h2>View Reservations</h2>
                </div>
                <div className="search-bar-edit-container">
                    <div className="reservation-searchbar">
                        <SearchBar 
                            onSearch={this.handleSearch} 
                            placeholder={"Search by Email"}
                        />
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

                {showScanPopup && (
                    <ScanPopup 
                        onClose={this.toggleScanModal} 
                        selectedOption={selectedOption}
                        onOptionChange={this.handleOptionChange}
                    />
                )}

                {showViewDetailPopup && reservationDetails && (
                    <ReservationDetailPopup 
                        onClose={this.handleCloseViewDetailModal}
                        reservationDetails={reservationDetails} // Pass the fetched details
                    />
                )}
            </>
        );
    }
}

export default ReservationTable;
