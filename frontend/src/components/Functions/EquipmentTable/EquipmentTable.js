import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
// import { getItems, deleteGlobalItem, updateItem } from '../../../connector.js';
import { getItems, deleteGlobalItem } from '../../../connector.js';
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
            tempDeletedRows: [],
            updatedRoles: {},
            defaultColDef: {
                sortable: true,
                resizable: true
            },
            searchQuery: ''
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
                }))
            );

            this.setState({
                records: transformedRecords,
                filteredRecords: transformedRecords,
                tempDeletedRows: [],
                updatedRoles: {}
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
                await deleteGlobalItem(id);
            }
            this.setState({ tempDeletedRows: [] });
        } catch (error) {
            console.error("Error saving deletions:", error);
        }
    };

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.itemName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
    };

    handleRoleChange = (id, newRole) => {
        this.setState(prevState => ({
            updatedRoles: {
                ...prevState.updatedRoles,
                [id]: newRole
            }
        }));
    };

    saveChanges = async () => {
        try {
            await this.confirmDeleteRows();
            this.loadRecords();
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    render() {
        const { isEditMode, toggleEditMode } = this.props;
        const containerStyles = { gap: isEditMode ? '20%' : '13.5%' };
        // const searchBarStyle = isEditMode ? { marginRight: '20%' } : {};



        const columnDefs = [
            { headerName: "ItemID", field: `itemId`, flex: 1 },
            { headerName: "Item Name", field: "itemName", flex: 1 },
            { headerName: "Price", field: "pricePerItem", flex: 1 },
            {
                headerName: "Checked-in",
                field: "checkin",
                flex: 1,
                valueFormatter: (params) => params.value ? params.value : 'N/A'
            },
            {
                headerName: "Checked-out",
                field: "checkout",
                flex: 1,
                valueFormatter: (params) => params.value ? params.value : 'N/A'
            },
            { headerName: "Repair", field: "repair", flex: 1 },

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
                    rowData={this.state.filteredRecords}
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