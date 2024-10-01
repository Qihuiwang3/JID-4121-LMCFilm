import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable'; 
import SearchBar from '../SearchBar/SearchBar'; 
import EditButton from '../../Button/EditButton/EditButton'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getAllDamageReports, deleteDamageReport, updateDamageReport } from "../../../connector"; 
import DamageReportModal from "../../Modal/DamageReportModal/DamageReportModal";
import './DamageTable.css';

class DamageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filteredRecords: [],
            tempDeletedRows: [],
            updatedDescriptions: {},
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: '',
            showAddNewPopup: false,
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getAllDamageReports();
            this.setState({ 
                records,
                filteredRecords: records, 
                tempDeletedRows: [],
                updatedDescriptions: {} 
            });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    tempDeleteRow = (data) => {
        this.setState((prevState) => {
            const updatedRecords = prevState.records.filter(record => record._id !== data._id);
            const updatedFilteredRecords = prevState.filteredRecords.filter(record => record._id !== data._id);
    
            return {
                records: updatedRecords,
                filteredRecords: updatedFilteredRecords, 
                tempDeletedRows: [...prevState.tempDeletedRows, data._id]
            };
        });
    };

    confirmDeleteRows = async () => {
        try {
            const { tempDeletedRows } = this.state;
            for (let id of tempDeletedRows) {
                await deleteDamageReport(id); 
            }
            this.setState({ tempDeletedRows: [] });
        } catch (error) {
            console.error("Error saving deletions:", error);
        }
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.itemId.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
    };

    handleDescriptionChange = (id, newDescription) => {
        this.setState(prevState => ({
            updatedDescriptions: {
                ...prevState.updatedDescriptions,
                [id]: newDescription
            }
        }));
    };

    saveChanges = async () => {
        try {
            const { updatedDescriptions } = this.state;
            for (let [id, description] of Object.entries(updatedDescriptions)) {
                await updateDamageReport(id, { description });
            }
            await this.confirmDeleteRows();
            this.setState({ updatedDescriptions: {} });
            this.loadRecords();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    handleOpenPopup = () => {
        this.setState({ showAddNewPopup: true });
    };

    handleClosePopup = () => {
        this.setState({ showAddNewPopup: false });
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { gap: isEditMode ? '40%' : '33.5%' };
        const { showAddNewPopup, filteredRecords } = this.state;

        const columnDefs = [
            { headerName: "Item ID", field: "itemId", flex: 1 },
            { headerName: "Item Name", field: "itemName", flex: 1 },
            { headerName: "Reported Date", field: "dateCreated", flex: 1 },
            { headerName: "Reporter", field: "reporter", flex: 1 },
            {
                headerName: "Repair",
                field: "isRepaired",
                flex: 1,
                cellRenderer: params => params.value ? "Yes" : "No"
            },
            {
                headerName: "View",
                field: "view",
                flex: 1,
                cellRenderer: params => (
                    <a href={`/damage-report/${params.data._id}`} className="view-details">
                        View Details
                    </a>
                )
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
                <div className="damage-title">
                    <h2>Damage Report</h2>
                </div>
                <div className="search-bar-edit-container" style={containerStyles}>
                    <div className="damage-searchbar" >
                        <SearchBar onSearch={this.handleSearch} placehoder={""} />
                    </div>
                    {!isEditMode && (
                        <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
                    )}
                    {isEditMode && (
                        <div className="add-new-container">
                            <button className="add-new-button" onClick={this.handleOpenPopup}>
                                Add New +
                            </button>
                        </div>
                    )}
                </div>
                <AgGridTable
                    rowData={filteredRecords} 
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
                {showAddNewPopup && (
                    <DamageReportModal show={showAddNewPopup} handleClose={this.handleClosePopup} />
                )}
            </>
        );
    }
}

export default DamageTable;
