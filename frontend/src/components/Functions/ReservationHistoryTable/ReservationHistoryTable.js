import React, { useState, useEffect } from 'react';
import AgGridTable from '../AgGridTable/AgGridTable';
import { getAllOrders } from '../../../connector';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BarCodePopup from '../../Modal/BarCodePopup/BarCodePopup';
import './ReservationHistoryTable.css';
import StudentViewDamageModal from '../../Modal/StudentViewDamageModal/StudentViewDamageModal';

import ReservationDetailPopup from '../../Modal/ReservationDetailPopup/ReservationDetailPopup';

const ReservationHistoryTable = () => {
    const [records, setRecords] = useState([]);
    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const [viewReportId, setViewReportId] = useState(null);
    const [viewDamageId, setViewDamageId] = useState(null);
    const [viewOrderDetailsId, setViewOrderDetailsId] = useState(null);


    useEffect(() => {
        const loadRecords = async () => {
            try {
                const records = await getAllOrders();
                const studentInfo = location.state?.studentInfo || reduxStudentInfo;

                // Filter orders based on account email and student name
                const transformedRecords = records
                    .filter(record =>
                        record.studentName === studentInfo.name && record.email === studentInfo.email
                    )
                    .map(record => ({
                        // code: record.orderNumber,
                        // checkin: record.checkin,
                        // checkout: record.checkout,
                        // email: record.email,
                        // studentName: record.studentName,
                        ...record,
                    }));

                console.log(studentInfo);
                setRecords(transformedRecords);
            } catch (error) {
                console.error("Error loading records:", error);
            }
        };

        loadRecords();
    }, [location.state, reduxStudentInfo]);

    const handleViewReport = (orderNumber) => {
        setViewReportId(orderNumber);
    };

    const handleViewDamage = (id) => {
        setViewDamageId(id);
    };

    const handleViewDetailsModal = (id) => {
        setViewOrderDetailsId(id);
    }

    const handleCloseModal = () => {
        setViewReportId(null);
        setViewDamageId(null);
        setViewOrderDetailsId(null);
    };



    const columnDefs = [
        {
            headerName: "Code",
            maxWidth: 130,
            cellStyle: { cursor: 'pointer' },
            cellRenderer: params => (
                <span
                    onClick={() => handleViewReport(params.data.code)}
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
            cellStyle: { cursor: 'pointer', textDecoration: 'underline' },
            valueGetter: () => "View Details",
            cellRenderer: params => (
                <span
                    onClick={() => handleViewDamage(params.data.code)}
                    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
                    className="clickable-text"
                >
                    View Damage Report
                </span>
            )

        },
        {
            headerName: "View Details",
            flex: 1,
            cellStyle: { cursor: 'pointer', textDecoration: 'underline' },
            cellRenderer: params => (
                <span
                    onClick={() => {
                        console.log(params.data);
                        handleViewDetailsModal(params.data);
                    }}
                    style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
                    className="clickable-text"
                >
                    View Details
                </span>
            )
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
            {viewDamageId && (
                <StudentViewDamageModal
                    show={!!viewDamageId}
                    orderNumber={viewDamageId}
                    handleClose={handleCloseModal}
                />
            )}
            {viewOrderDetailsId && (
                <ReservationDetailPopup
                    reservationDetails={viewOrderDetailsId}
                    onClose={handleCloseModal} />
            )}
        </>
    );
};

export default ReservationHistoryTable;
