import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
// import { getItems, deleteGlobalItem, updateItem } from '../../../connector.js';
import { getItems, deleteGlobalItem, toggleRepairStatus, toggleHideStatus } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import EditButton from '../../Button/EditButton/EditButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

class EquipmentTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filteredRecords: [],
            deletedRecords: [],
            tempToggledRepairs: [],
            tempToggledHides: [],
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: '',
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getItems();

            // Flatten the data by mapping each record's itemIds into separate rows
            const transformedRecords = records.flatMap(record =>
                record.itemIds.map(itemId => ({
                    _id: record._id,
                    itemName: record.itemName,
                    pricePerItem: record.pricePerItem,
                    itemId: itemId.itemId,
                    checkin: itemId.checkin,
                    checkout: itemId.checkout,
                    repair: itemId.repair,
                    hide: itemId.hide,
                }))
            );

            this.setState({
                records: transformedRecords,
                filteredRecords: transformedRecords,
            });
        } catch (error) {
        }
    };

    tempDelete = async (data) => {
        const { filteredRecords, deletedRecords } = this.state;

        const updatedRecords = filteredRecords.filter(record =>
            !(record.itemName === data.itemName && record.itemId === data.itemId)
        );

        this.setState({
            filteredRecords: updatedRecords,
            deletedRecords: [...deletedRecords, data],
        });
    }

    tempToggleRepair = (data) => {
        const { filteredRecords, tempToggledRepairs } = this.state;

        // Toggle the repair status for the given item
        const updatedRecords = filteredRecords.map(record =>
            record.itemName === data.itemName && record.itemId === data.itemId
                ? { ...record, repair: !record.repair }
                : record
        );

        this.setState({
            filteredRecords: updatedRecords,
            tempToggledRepairs: [...tempToggledRepairs, data], // Add to the tempToggledRepairs list
        });
    };

    tempToggleHide = (data) => {
        const { filteredRecords, tempToggledHides } = this.state;

        // Toggle the hide status for the given item
        const updatedRecords = filteredRecords.map(record =>
            record.itemName === data.itemName && record.itemId === data.itemId
                ? { ...record, hide: !record.hide }
                : record
        );

        this.setState({
            filteredRecords: updatedRecords,
            tempToggledHides: [...tempToggledHides, data], // Add to the tempToggledHides list
        });
    };



    saveChanges = async () => {
        const { deletedRecords, tempToggledRepairs, tempToggledHides } = this.state;

        try {
            // Loop through each deleted record and call deleteGlobalItem
            for (let record of deletedRecords) {
                await deleteGlobalItem(record.itemName, record.itemId);
            }

            // Clear the deleted records after successful deletion
            this.setState({ deletedRecords: [] });

            // Loop through the tempToggledRepairs list
            for (let record of tempToggledRepairs) {
                const { itemName, itemId } = record;
                await toggleRepairStatus(itemName, itemId);
            }

            // Loop through the tempToggledHides list
            for (let record of tempToggledHides) {
                const { itemName, itemId } = record;
                await toggleHideStatus(itemName, itemId);
            }

            // Clear the toggled lists after successful changes
            this.setState({ tempToggledRepairs: [], tempToggledHides: [] });

        } catch (error) {
            console.error("Error saving changes:", error);
        }
        this.loadRecords();
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.itemName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { gap: isEditMode ? '20%' : '13.5%' };
        // const searchBarStyle = isEditMode ? { marginRight: '20%' } : {};

        const columnDefs = [
            { headerName: "ItemID", field: `itemId`, flex: 1 },
            { headerName: "Item Name", field: "itemName", flex: 1 },
            {
                headerName: "Price",
                field: "pricePerItem",
                flex: 1,
                valueFormatter: (params) => {
                    return params.value !== undefined ? `$${params.value.toFixed(2)}` : 'N/A';
                }
            },
            {
                headerName: "Checked-in",
                field: "checkin",
                flex: 1,
                valueFormatter: (params) => {
                    const dateValue = new Date(params.value);
                    return params.value ? dateValue.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).replace(',', '') : 'N/A';
                }
            },
            {
                headerName: "Checked-out",
                field: "checkout",
                flex: 1,
                valueFormatter: (params) => {
                    const dateValue = new Date(params.value);
                    return params.value ? dateValue.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).replace(',', '') : 'N/A';
                }
            },
            {
                headerName: "Repair",
                field: "repair",
                flex: 1,
                editable: false, // make the cell non-editable
                cellRenderer: (params) => {
                    return params.value ? 'Yes' : 'No'; // render 'Yes' or 'No' based on the value
                }
            },
            {
                headerName: "Hide",
                field: "hide",
                flex: 1,
                valueFormatter: (params) => params.value ? 'Yes' : 'No', // Display "Yes" or "No"
                cellRenderer: isEditMode ? (params) => {
                    return (
                        <select
                            value={params.data.hide ? 'Yes' : 'No'}
                            onChange={(event) => this.tempToggleHide(params.data, event.target.value)}
                            style={{
                                width: '50px',                 // Width of the dropdown
                                padding: '4px',                // Padding inside the dropdown
                                color: 'white',                // Text color
                                backgroundColor: '#3361AE',    // Background color
                                border: 'none',                // No border
                                borderRadius: '5px',           // Rounded corners
                                textAlign: 'center'            // Center-align the text
                            }}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    );
                } : null
            },

            isEditMode ? {
                headerName: "Delete",
                field: "delete",
                flex: 1,
                cellRenderer: params => {
                    return (
                        <button
                            onClick={() => { this.tempDelete(params.data) }}
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
                    <h2>Equipment</h2>
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
                    key={this.state.filteredRecords.length}
                    rowData={this.state.filteredRecords} // Make sure this points to filteredRecords
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />
            </>
        );
    }
}

export default EquipmentTable