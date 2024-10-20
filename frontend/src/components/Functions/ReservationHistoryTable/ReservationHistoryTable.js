import React, { useState, useEffect } from 'react';
import AgGridTable from '../AgGridTable/AgGridTable';
import { getAllOrders } from '../../../connector';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ReservationHistoryTable.css';

const ReservationHistoryTable = () => {
    const [records, setRecords] = useState([]);
    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);

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
                        code: record.orderNumber,
                        checkin: record.checkin,
                        checkout: record.checkout,
                        email: record.email,
                        studentName: record.studentName,
                    }));

                console.log(studentInfo);
                setRecords(transformedRecords);
            } catch (error) {
                console.error("Error loading records:", error);
            }
        };

        loadRecords();
    }, [location.state, reduxStudentInfo]);

    const columnDefs = [
        {
            headerName: "Code",
            field: "code",
            flex: 1,
            cellStyle: { cursor: 'pointer' },
        },
        {
            headerName: "Pick Up Date",
            field: "checkin",
            flex: 1,
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
            flex: 1,
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
        },
        {
            headerName: "View Details",
            flex: 1,
            cellStyle: { cursor: 'pointer', textDecoration: 'underline' },
            valueGetter: () => "View Details",
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
        </>
    );
};

export default ReservationHistoryTable;
