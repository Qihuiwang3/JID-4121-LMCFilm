import React, { useState, useEffect } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import DamageSearch from "../DamageSearch/DamageSearch"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getAllDamageReports, deleteDamageReport, toggleRepairStatus, getRepairStatus } from "../../../connector"; 
import DamageReportModal from "../../Modal/DamageReportModal/DamageReportModal";
import ViewDamageModal from "../../Modal/ViewDamageModal/ViewDamageModal";
import './DamageTable.css';

const DamageTable = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddNewPopup, setShowAddNewPopup] = useState(false);
    const [viewReportId, setViewReportId] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const fetchedRecords = await getAllDamageReports();
                const updatedRecords = await Promise.all(
                    fetchedRecords.map(async (record) => {
                        try {
                            const repairStatus = await getRepairStatus(record.itemName, record.itemId);
                            return {
                                ...record,
                                isRepaired: repairStatus.repair,  
                            };
                        } catch (error) {
                            console.error('Error fetching repair status:', error);
                            return { ...record, isRepaired: false }; 
                        }
                    })
                );

                setRecords(updatedRecords);
                setFilteredRecords(updatedRecords);
            } catch (error) {
                console.error("Error loading records:", error);
            }
        };

        fetchRecords();
    }, []);

    const handleDeleteRow = async (data) => {
        try {
            await deleteDamageReport(data._id);
            setRecords(prevRecords => prevRecords.filter(record => record._id !== data._id));
            setFilteredRecords(prevFiltered => prevFiltered.filter(record => record._id !== data._id));
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = records.filter(record => record.itemId.toLowerCase().includes(query.toLowerCase()));
        setFilteredRecords(filtered);
    };

    const handleNewReportAdded = async (newReport) => {
        try {
            const repairStatus = await getRepairStatus(newReport.itemName, newReport.itemId);
            const newReportWithRepairStatus = {
                ...newReport,
                isRepaired: repairStatus.repair, 
            };

            setRecords(prevRecords => [...prevRecords, newReportWithRepairStatus]);
            setFilteredRecords(prevFilteredRecords => [...prevFilteredRecords, newReportWithRepairStatus]);
        } catch (error) {
            console.error("Error fetching repair status for the new report:", error);
        }
    };


    const handleOpenPopup = () => setShowAddNewPopup(true);
    const handleClosePopup = () => setShowAddNewPopup(false);

    const handleViewReport = (id) => {
        setViewReportId(id); 
    };

    const handleCloseModal = () => {
        setViewReportId(null); 
    };

    const handleRepairStatusChange = async (data, newStatus) => {
        try {
            await toggleRepairStatus(data.itemName, data.itemId);
            setRecords(prevRecords => prevRecords.map(record => 
                record._id === data._id ? { ...record, isRepaired: newStatus === "Yes" } : record
            ));
            setFilteredRecords(prevFiltered => prevFiltered.map(record => 
                record._id === data._id ? { ...record, isRepaired: newStatus === "Yes" } : record
            ));
        } catch (error) {
            console.error("Error updating repair status:", error);
        }
    };


    const columnDefs = [
        { headerName: "Item ID", field: "itemId", flex: 1 },
        { headerName: "Item Name", field: "itemName", flex: 1 },
        { 
            headerName: "Reported Date", 
            field: "dateCreated", 
            flex: 1,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString(); 
            }
        },
        { headerName: "Reporter", field: "reporter", flex: 1 },
        {
            headerName: "Repair",
            field: "isRepaired",
            flex: 1,
            cellRenderer: (params) => (
                <select
                    value={params.value ? "Yes" : "No"}
                    onChange={(e) => handleRepairStatusChange(params.data, e.target.value)}
                    className="repair-dropdown"
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            )
        },
        {
            headerName: "View",
            field: "view",
            flex: 1,
            cellRenderer: params => (
                <button onClick={() => handleViewReport(params.data._id)} className="view-details">
                    View Details
                </button>
            )
        },
        {
            headerName: "Delete",
            field: "delete",
            flex: 1,
            cellRenderer: params => (
                <button 
                    onClick={() => handleDeleteRow(params.data)} 
                    className="trash-icon"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )
        }
    ];

    return (
        <>
            <div className="damage-title">
                <h2>Damage Report</h2>
            </div>
            <div className="search-bar-edit-container">
                <div className="damage-searchbar">
                    <DamageSearch onSearch={handleSearch} placehoder={"Search by Item ID"} />
                </div>

                <div className="add-new-container">
                    <button className="add-new-button" onClick={handleOpenPopup}>
                        Add New +
                    </button>
                </div>
            </div>
            <AgGridTable
                rowData={filteredRecords} 
                columnDefs={columnDefs}
                defaultColDef={{
                    sortable: true,
                    resizable: true
                }}
                domLayout="autoHeight"
                suppressHorizontalScroll={true}
            />
            {viewReportId && (
                <ViewDamageModal 
                    show={!!viewReportId} 
                    reportId={viewReportId} 
                    handleClose={handleCloseModal} 
                />
            )}
            {showAddNewPopup && (
                <DamageReportModal 
                    show={showAddNewPopup} 
                    handleClose={handleClosePopup} 
                    onReportAdded={handleNewReportAdded} 
                />
            )}
        </>
    );
};

export default DamageTable;