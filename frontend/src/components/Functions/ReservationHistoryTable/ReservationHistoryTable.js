import React, { useState, useEffect } from 'react';
import AgGridTable from '../AgGridTable/AgGridTable';
import { getAllOrders, getAllDamageReports } from '../../../connector';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BarCodePopup from '../../Modal/BarCodePopup/BarCodePopup';
import './ReservationHistoryTable.css';
import ReservationHistoryViewDamageReportModal from '../../Modal/ReservationHistoryViewDamageReportModal/ReservationHistoryViewDamageReportModal';

import ReservationDetailPopup from '../../Modal/ReservationDetailPopup/ReservationDetailPopup';

const ReservationHistoryTable = () => {
    const [records, setRecords] = useState([]);
    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const [viewReportId, setViewReportId] = useState(null);
    const [viewDamageReportInfo, setViewDamageReportInfo] = useState(null);
    const [viewOrderDetailsId, setViewOrderDetailsId] = useState(null);

    const [allDamageReports, setAllDamageReports] = useState([]);

    const loadRecords = async () => {
        try {
            const records = await getAllOrders();
            const studentInfo = location.state?.studentInfo || reduxStudentInfo;

                // Filter orders based on account email and student name
                const transformedRecords = records
                    .filter(record =>
                        record.email === studentInfo.email
                    )
                    .map(record => ({
                        code: record.orderNumber,
                        checkin: record.checkin,
                        checkout: record.checkout,
                        email: record.email,
                        studentName: record.studentName,
                    }));
                setRecords(transformedRecords);
            } catch (error) {
                console.error("Error loading records:", error);
        }
    };

    useEffect(() => {
        loadRecords();
        loadDamageReports();
    }, [location.state, reduxStudentInfo]);

    const handleViewReport = (orderNumber) => {
        setViewReportId(orderNumber);
    };

    const handleViewDetailsModal = (id) => {
        setViewOrderDetailsId(id);
    }

    const handleViewDamageReport = (orderNumber) => {
        const damageReports = allDamageReports.filter(report => report.orderNumber === orderNumber);
        if (damageReports.length > 0) {
            setViewDamageReportInfo(damageReports);
        } else {
            setViewDamageReportInfo(null);
        }
    };

    const handleCloseModal = () => {
        setViewReportId(null);
        setViewDamageReportInfo(null);
        setViewOrderDetailsId(null);
    };

    const loadDamageReports = async () => {
        try {
            const damageReports = await getAllDamageReports();
            setAllDamageReports(damageReports);
        } catch (error) {
            console.error("Error loading damage reports:", error);
        }
    };



    const columnDefs = [
        {
            headerName: "Code",
            maxWidth: 130,
            cellStyle: { cursor: 'pointer' },
            cellRenderer: params => (
                <span
                    onClick={() => handleViewReport(params.data.orderNumber)}
                    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
                    className="clickable-text"
                >
                    View Code
                </span>
            )
        },
        {
            headerName: "Pick Up Date",
            field: "checkin",
            maxWidth: 200,
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
            headerName: "Return Date",
            field: "checkout",
            maxWidth: 200,
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
            headerName: "View Damage Report",
            flex: 1,
            valueGetter: () => "View Details",
            cellRenderer: params => {
                const orderNumber = params.data.code;

                const hasDamageReport = allDamageReports.some(
                    (report) => report.orderNumber == orderNumber
                );

                return hasDamageReport ? (
                    <button
                        onClick={() => handleViewDamageReport(orderNumber)}
                        className="view-details"
                    >
                        View Details
                    </button>
                ) : (
                    <span className="no-class-code">No Damage Report</span>
                )
            }
        },
        {
            headerName: "View Details",
            flex: 1,
            cellStyle: { cursor: 'pointer', textDecoration: 'underline' },
            cellRenderer: params => (
                <span
                    onClick={() => {
                        handleViewDetailsModal(params.data);
                    }}
                    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
                    className="clickable-text"
                >
                    View Details
                </span>
            )
        },
        {
            headerName: "Created At",
            field: "createdAt",
            hide: true, // Hide this column but still use it for sorting
            sort: 'desc', // Sort by createdAt in descending order by default
            valueFormatter: (params) => {
                const dateValue = new Date(params.value);
                return dateValue.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            }
        }

    ];

    return (
        <>
            <div className="flex-container">
                <h1 className="rh-history-heading"> Reservation History </h1>
            </div>

            <AgGridTable
                key={records.length}
                rowData={records}
                columnDefs={columnDefs}
                defaultColDef={{ flex: 1 }}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
            />
            {viewReportId && (
                <BarCodePopup
                    show={!!viewReportId}
                    orderNumber={viewReportId}
                    handleClose={handleCloseModal}
                />
            )}
            {viewDamageReportInfo && (
                <ReservationHistoryViewDamageReportModal
                    show={!!viewDamageReportInfo}
                    damageReportInfo={viewDamageReportInfo}
                    handleClose={handleCloseModal}
                />
            )}
           {viewOrderDetailsId && (
                <ReservationDetailPopup
                    reservationDetails={viewOrderDetailsId}
                    onClose={handleCloseModal}
                    onOrderCancelled={loadRecords}
                    onOrderExtended={loadRecords}
                    showButtons={true} 
    />
)}

        </>
    );
};

export default ReservationHistoryTable;
