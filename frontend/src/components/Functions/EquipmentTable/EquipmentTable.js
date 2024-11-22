import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
import { getItems, deleteGlobalItem, toggleRepairStatus, toggleHideStatus } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './EquipmentTable.css';
import StatusModal from "../../Modal/StatusModal/StatusModal.js";
import DeletePopup from "../../Modal/DeletePopupModal/DeletePopup";
import EditEquipmentModal from "../../Modal/EditEquipmentModal/EditEquipmentModal";
import EquipmentPopup from "../../Modal/EquipmentPopup/EquipmentPopup.js";


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
            showDeletePopup: false,
            showModal: false,
            itemToDelete: null, 
            selectedItem: null,
            showEditModal: false,
            equipmentToEdit: null,
            showAddModal: false,
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
            console.error("Error loading records:", error);
        }
    };

    tempDelete = (data) => {
        this.setState({
            showDeletePopup: true,
            itemToDelete: data,
        });
    };

    confirmDelete = async () => {
        const { itemToDelete, filteredRecords, deletedRecords } = this.state;

        const updatedRecords = filteredRecords.filter(record =>
            !(record.itemName === itemToDelete.itemName && record.itemId === itemToDelete.itemId)
        );

        this.setState({
            filteredRecords: updatedRecords,
            deletedRecords: [...deletedRecords, itemToDelete],
            showDeletePopup: false,
            itemToDelete: null,
        }, this.saveChanges);
    };

    closeDeletePopup = () => {
        this.setState({
            showDeletePopup: false,
            itemToDelete: null,
        });
    };


    tempToggleRepair = (data) => {
        const { filteredRecords, tempToggledRepairs } = this.state;

        const updatedRecords = filteredRecords.map(record =>
            record.itemName === data.itemName && record.itemId === data.itemId
                ? { ...record, repair: !record.repair }
                : record
        );

        this.setState({
            filteredRecords: updatedRecords,
            tempToggledRepairs: [...tempToggledRepairs, data],
        }, this.saveChanges);
    };

    tempToggleHide = (data) => {
        const { filteredRecords, tempToggledHides } = this.state;

        const updatedRecords = filteredRecords.map(record =>
            record.itemName === data.itemName && record.itemId === data.itemId
                ? { ...record, hide: !record.hide }
                : record
        );

        this.setState({
            filteredRecords: updatedRecords,
            tempToggledHides: [...tempToggledHides, data],
        }, this.saveChanges);
    };

    saveChanges = async () => {
        const { deletedRecords, tempToggledRepairs, tempToggledHides } = this.state;

        try {
            for (let record of deletedRecords) {
                await deleteGlobalItem(record.itemName, record.itemId);
            }

            this.setState({ deletedRecords: [] });

            for (let record of tempToggledRepairs) {
                const { itemName, itemId } = record;
                await toggleRepairStatus(itemName, itemId);
            }

            for (let record of tempToggledHides) {
                const { itemName, itemId } = record;
                await toggleHideStatus(itemName, itemId);
            }

            this.setState({ tempToggledRepairs: [], tempToggledHides: [] });

        } catch (error) {
            console.error("Error saving changes:", error);
        }
        this.loadRecords();
    };

    openEditModal = (equipment) => {
        this.setState({ showEditModal: true, equipmentToEdit: equipment });
    };

    closeEditModal = () => {
        this.setState({ showEditModal: false, equipmentToEdit: null });
    };

    openAddModal = () => {
        this.setState({ showAddModal: true });
    };

    closeAddModal = () => {
        this.setState({ showAddModal: false });
    };

    closeModal = () => {
        this.setState({ showModal: false });
    }


    handleEquipmentUpdated = async () => {
        await this.loadRecords(); 
    };
    

    handleSearch = (query) => {
        const { records } = this.state;
        const filteredRecords = records.filter(record =>
            record.itemName.toLowerCase().includes(query.toLowerCase())
        );
        this.setState({ filteredRecords, searchQuery: query });
    };

    handleStatusClick = (item) => {
        this.setState({ showModal: true, selectedItem: item });
    };


    render() {
        const { handleOpenPopup, openEditModal, showEditModal, equipmentToEdit } = this.props;

        const columnDefs = [
            {
                headerName: "ItemID",
                field: "itemId",
                headerClass: 'header-center',
                flex: 1,
                cellRenderer: params => (
                    <>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                            alt="Edit"
                            className="edit-icon"
                            onClick={() => this.openEditModal(params.data)}
                            style={{
                                cursor: 'pointer',
                                width: '12px',
                                marginRight: '8px',
                                filter: 'invert(27%) sepia(78%) saturate(668%) hue-rotate(177deg) brightness(97%) contrast(96%)'
                            }}
                        />
                        {params.value}
                    </>
                )
            },
            {
                headerName: "Item Name",
                field: "itemName",
                flex: 1,
            },
            {
                headerName: "Price",
                field: "pricePerItem",
                flex: 1,
                valueFormatter: (params) => {
                    return params.value !== undefined ? `$${params.value.toFixed(2)}` : 'Available';
                }
            },
            {
                headerName: "Status",
                field: "status",
                flex: 1,
                cellRenderer: (params) => {
                    const isAvailable = !params.data.checkout && !params.data.checkin;
                    if (isAvailable) {
                        return "Available";
                    }
                    return (
                        <span
                            style={{ color: "#3361AE", cursor: "pointer" }}
                            className="not-available-text"
                            onClick={() => this.handleStatusClick(params.data)}
                        >
                            Not Available
                        </span>
                    );
                },
            },
            {
                headerName: "Repairing",
                field: "repair",
                flex: 1,
                editable: false,
                cellRenderer: (params) => {
                    return params.value ? 'Yes' : 'No'; // render 'Yes' or 'No' based on the value
                }
            },
            {
                headerName: "Hide",
                field: "hide",
                flex: 1,
                cellRenderer: params => {
                    return (
                        <select
                            value={params.data.hide ? 'Yes' : 'No'}
                            onChange={(event) => this.tempToggleHide(params.data, event.target.value)}
                            style={{
                                width: '50px',
                                padding: '4px',
                                color: 'white',
                                backgroundColor: '#3361AE',
                                border: 'none',
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    );
                }
            },
            {
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
            }
        ];

        return (
            <>
                <div className="flex-container">
                    <h1 className="equipment-heading"> Equipment </h1>
                </div>
                <div className="equipment-search-bar-edit-container">
                    <div className="student-searchbar" >
                        <SearchBar
                            onSearch={this.handleSearch}
                            placeholder={"Search by Item Name"}
                        />
                    </div>

                    <div className="">
                        <button className="add-new-button" onClick={this.openAddModal}>
                            Add New +
                        </button>
                    </div>
                </div>

                <AgGridTable
                    key={this.state.filteredRecords.length}
                    rowData={this.state.filteredRecords}
                    columnDefs={columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={true}
                />

                {/* Delete Confirmation Popup */}
                <DeletePopup
                    show={this.state.showDeletePopup}
                    handleClose={this.closeDeletePopup}
                    handleDelete={this.confirmDelete}
                />

                <StatusModal
                    show={this.state.showModal}
                    onClose={this.closeModal}
                    item={this.state.selectedItem}
                />

                <EditEquipmentModal
                    show={this.state.showEditModal}
                    handleClose={this.closeEditModal}
                    equipmentToEdit={this.state.equipmentToEdit}
                    onEquipmentUpdated={this.handleEquipmentUpdated}
                />

                <EquipmentPopup
                    show={this.state.showAddModal}
                    handleClose={this.closeAddModal}
                    onEquipmentUpdated={this.handleEquipmentUpdated}
                />

            </>
        );
    }
}

export default EquipmentTable;
