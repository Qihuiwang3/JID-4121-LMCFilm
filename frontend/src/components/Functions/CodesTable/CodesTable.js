import React, { useEffect, useState } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
import { getClassCodes, createClassCode, createBundleItem, getItems, createSingleItem, deleteClassCode, getBundleItemsByClassCode, updateClassCode, updateBundleItem, getSingleItemsByClassCode, removeSingularItem } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CodesTable.css';
import DeletePopup from "../../Modal/DeletePopupModal/DeletePopup";

function CodesTable() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [initialEquipment, setInitialEquipment] = useState([]);
    const [hasExistingBundle, setHasExistingBundle] = useState(false);

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);

    const [newClass, setNewClass] = useState({
        className: '',
        professor: '',
        code: '',
        bundleId: '',
        bundleName: '',
        price: '',
        equipment: [],
        bundleEquipment: [],
    });

    const [editClassData, setEditClassData] = useState({
        className: '',
        professor: '',
        code: '',
        bundleId: '',
        bundleName: '',
        price: '',
        equipment: [],
        bundleEquipment: [],
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        loadRecords();
        fetchEquipment();
    }, []);

    const loadRecords = async () => {
        try {
            const classCodes = await getClassCodes();
            const flattenedRecords = await Promise.all(classCodes.map(async (classCode) => {
                try {
                    const bundleItems = await getBundleItemsByClassCode(classCode.code);
                    const bundleName = bundleItems.length > 0 ? bundleItems[0].bundleName : "N/A";
                    return {
                        code: classCode.code,
                        className: classCode.className,
                        professor: classCode.professor,
                        bundleName: bundleName,
                    };
                } catch (error) {
                    return {
                        code: classCode.code,
                        className: classCode.className,
                        professor: classCode.professor,
                        bundleName: "N/A",
                    };
                }
            }));
            const reverseRecords = flattenedRecords.reverse();
            setRecords(reverseRecords);
            setFilteredRecords(reverseRecords);
        } catch (error) { }
    };

    const fetchEquipment = async () => {
        try {
            const equipmentList = await getItems();
            setAvailableEquipment(equipmentList);
        } catch (error) { }
    };

    const handleSearch = (query) => {
        const filteredRecords = records.filter(record =>
            record.className && record.className.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRecords(filteredRecords);
        setSearchQuery(query);
    };

    const openAddModal = () => {

        const randomCode = Math.floor(1000 + Math.random() * 9000);
        setGeneratedCode(randomCode);
        setNewClass({
            className: '',
            professor: '',
            bundleId: '',
            bundleName: '',
            price: '',
            equipment: [],
            bundleEquipment: [],
        });
        setIsModalOpen(true);
    };

    const closeAddModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClass(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isAddButtonDisabled = !newClass.className || !newClass.professor;

    const handleAddNewClassToScreen = async () => {
        const newEntry = {
            code: generatedCode || newClass.code,
            className: newClass.className,
            professor: newClass.professor,
            bundleId: newClass.bundleId || null,
            bundleName: newClass.bundleName || "N/A",
            price: newClass.price || null,
            equipment: newClass.equipment || [],
            bundleEquipment: newClass.bundleEquipment || [],
        };
        try {
            await createClassCode({
                code: newEntry.code,
                professor: newEntry.professor,
                className: newEntry.className,
            });
            const tempBundle = [];
            for (let equipmentItem of newClass.equipment) {
                const tempItem = await createSingleItem({
                    classCode: newEntry.code,
                    itemName: equipmentItem,
                });
                if (newClass.bundleEquipment.includes(equipmentItem)) {
                    tempBundle.push({
                        itemName: tempItem.itemName,
                        quantity: 1,
                    });
                }
            }
            if (newClass.bundleId && newClass.bundleName) {
                await createBundleItem({
                    bundleId: newClass.bundleId,
                    classCode: newEntry.code,
                    items: tempBundle,
                    price: newClass.price,
                    bundleName: newClass.bundleName,
                });
            }
            await loadRecords();
        } catch (error) { }
        closeAddModal();
    };

    const handleDeleteRow = (code) => {
        setSelectedCode(code);
        setIsDeletePopupOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteClassCode(selectedCode);
            setRecords(records.filter((record) => record.code !== selectedCode));
            setFilteredRecords(filteredRecords.filter((record) => record.code !== selectedCode));
        } catch (error) {
            console.error("Failed to delete record:", error);
        }
        closeDeletePopup();
    };

    const closeDeletePopup = () => {
        setIsDeletePopupOpen(false);
        setSelectedCode(null);
    };

    const openEditModal = async (code) => {
        const classToEdit = records.find((item) => item.code === code);
        let bundleInfo = { bundleName: 'N/A', bundleId: '', price: '', bundleEquipment: [] };
        let singleItems = [];

        try {
            const bundleItems = await getBundleItemsByClassCode(classToEdit.code);
            if (bundleItems.length > 0) {
                bundleInfo = {
                    bundleName: bundleItems[0].bundleName,
                    bundleId: bundleItems[0].bundleId,
                    price: bundleItems[0].price,
                    bundleEquipment: bundleItems[0].items || [],
                };
                setHasExistingBundle(true); // Set to true if there's an existing bundle
            } else {
                setHasExistingBundle(false); // Set to false if no bundle exists
            }
        } catch (error) {
            setHasExistingBundle(false); // If error, assume no bundle exists
        }

        try {
            singleItems = await getSingleItemsByClassCode(classToEdit.code);
        } catch (error) { }

        // Set the initial items for comparison later when saving (to avoid duplication)
        setInitialEquipment(singleItems || []);

        setEditClassData({
            ...classToEdit,
            ...bundleInfo,
            equipment: singleItems || [],
        });
        setIsEditModalOpen(true);
    };


    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEditClassChange = (e) => {
        const { name, value } = e.target;
        setEditClassData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleSaveEditedClass = async () => {
        try {
            // Update class data
            await updateClassCode(editClassData);

            const removedEquipment = initialEquipment.filter(
                initialItem => !editClassData.equipment.some(equipmentItem => equipmentItem.itemName === initialItem.itemName)
            );

            // Remove deselected equipment from the backend
            for (const removedItem of removedEquipment) {
                const itemToRemove = initialEquipment.find(item => item.itemName === removedItem.itemName);

                if (itemToRemove && itemToRemove._id) {  // Use the _id field as itemId
                    console.log("Attempting to remove item:", removedItem.itemName, "with ID:", itemToRemove._id);  // Debugging log
                    await removeSingularItem(removedItem.itemName, itemToRemove._id); // Pass _id as itemId
                } else {
                    console.error(`Item ID for ${removedItem.itemName} is undefined, skipping removal.`);
                }
            }

            // Filter out new equipment items that weren't part of the initial equipment
            const newEquipment = editClassData.equipment.filter(equipmentItem => {
                return !initialEquipment.some(initialItem => initialItem.itemName === equipmentItem.itemName);
            });

            // Add new equipment items to the backend
            const tempBundle = [];

            for (const equipmentItem of newEquipment) {
                const tempItem = await createSingleItem({
                    classCode: editClassData.code,
                    itemName: equipmentItem.itemName,
                });
                // Add only new items that are part of the bundle
                if (editClassData.bundleEquipment.includes(equipmentItem.itemName)) {
                    tempBundle.push({
                        itemName: tempItem.itemName,
                        quantity: 1,
                    });
                }
            }

            // Avoid duplicating existing items by using a Set to track what we've added
            const itemNamesSet = new Set(tempBundle.map(item => item.itemName));

            // Include existing items in the bundle, but avoid adding duplicates
            for (const equipmentItem of editClassData.bundleEquipment) {
                if (!itemNamesSet.has(equipmentItem.itemName)) {
                    tempBundle.push({
                        itemName: equipmentItem.itemName,
                        quantity: 1,
                    });
                    itemNamesSet.add(equipmentItem.itemName); // Track item names
                }
            }

            // Create or update bundle based on whether it existed initially
            if (!hasExistingBundle) {
                // If no existing bundle, create a new one
                if (editClassData.bundleName && editClassData.price && tempBundle.length > 0) {
                    const newBundle = await createBundleItem({
                        bundleId: editClassData.bundleId,  // Might be null if it's a new bundle
                        classCode: editClassData.code,
                        items: tempBundle, // Use the tempBundle array created above
                        price: editClassData.price,
                        bundleName: editClassData.bundleName,
                    });

                    // Update the bundle ID after creation
                    setEditClassData(prevState => ({
                        ...prevState,
                        bundleId: newBundle.bundleId,
                    }));
                }
            } else {
                // Update existing bundle with the new bundle items
                await updateBundleItem({
                    bundleName: editClassData.bundleName,
                    code: editClassData.code,
                    bundleId: editClassData.bundleId,
                    price: editClassData.price,
                    items: tempBundle, // Use tempBundle which now includes both new and existing items
                });
            }

            // Update frontend records
            const updatedRecords = records.map(item => {
                return item.code === editClassData.code ? editClassData : item;
            });

            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords);
            closeEditModal();
        } catch (error) {
            console.error("Error saving edited class:", error);
        }
    };






    const columnDefs = [
        {
            headerName: "Class", field: "className", flex: 1, cellRenderer: params => (
                <>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                        alt="Edit"
                        className="edit-icon"
                        onClick={() => openEditModal(params.data.code)}
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
        { headerName: "Code", field: "code", flex: 1 },
        { headerName: "Professor", field: "professor", flex: 1 },
        { headerName: "Package Name", field: "bundleName", flex: 1 },
        {
            headerName: "Delete",
            field: "delete",
            flex: 1,
            cellRenderer: params => (
                <button onClick={() => handleDeleteRow(params.data.code)} className="trash-icon">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            )
        }
    ];

    return (
        <>
            <div className="classCode-title">
                <h2>Class Codes</h2>
            </div>
            <div className="search-bar-edit-container">
                <div className="classCode-searchbar">
                    <SearchBar onSearch={handleSearch}
                        placeholder={"Search by Class"}
                    />
                </div>
                <button className="add-class-button" onClick={openAddModal}>
                    Add New <span className="plus-icon">+</span>
                </button>
            </div>
            <AgGridTable
                rowData={filteredRecords}
                columnDefs={columnDefs}
                defaultColDef={{ sortable: true, resizable: true }}
                domLayout="autoHeight"
            />
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content2">
                        <div className="modal-header">
                            <h2>Add New</h2>
                            <button className="close-button" onClick={closeAddModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <label>Code</label>
                                <input type="text" value={generatedCode} readOnly disabled className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Class</label>
                                    <input type="text" name="className" value={newClass.className} onChange={handleInputChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" name="professor" value={newClass.professor} onChange={handleInputChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Equipment For This Class</label>
                                <select
                                    name="equipment"
                                    value=""
                                    onChange={(e) => {
                                        const selectedEquipment = e.target.value;

                                        // Check if the equipment is already selected
                                        if (newClass.equipment.includes(selectedEquipment)) {
                                            // If it is already selected, remove it
                                            setNewClass(prevState => {
                                                const updatedEquipment = prevState.equipment.filter(eq => eq !== selectedEquipment);
                                                const updatedBundleEquipment = prevState.bundleEquipment.filter(be => be !== selectedEquipment);

                                                return {
                                                    ...prevState,
                                                    equipment: updatedEquipment,
                                                    bundleEquipment: updatedBundleEquipment,  // Also remove from bundle equipment
                                                };
                                            });
                                        } else {
                                            // Otherwise, add the selected equipment
                                            setNewClass(prevState => ({
                                                ...prevState,
                                                equipment: [...prevState.equipment, selectedEquipment],
                                            }));
                                        }
                                    }}
                                    className="modal-input2"
                                >
                                    <option value="">
                                        {newClass.equipment && newClass.equipment.length > 0
                                            ? newClass.equipment.join(', ')
                                            : 'Select Equipment'}
                                    </option>
                                    {availableEquipment.map((equipmentItem) => (
                                        <option
                                            key={equipmentItem._id}
                                            value={equipmentItem.itemName}
                                            style={{
                                                backgroundColor: newClass.equipment.includes(equipmentItem.itemName)
                                                    ? '#e0e0e0' // Highlight selected items in the dropdown
                                                    : 'white',
                                            }}
                                        >
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Package ID</label>
                                <input type="text" name="bundleId" value={newClass.bundleId} onChange={handleInputChange} className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="bundleName" value={newClass.bundleName} onChange={handleInputChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={newClass.price === '' ? '' : `$${newClass.price}`} // Show '' when empty, or the actual value
                                        onFocus={(e) => {
                                            if (newClass.price === '0') {
                                                setNewClass(prevState => ({
                                                    ...prevState,
                                                    price: '' // Clear the input when focused
                                                }));
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (newClass.price === '') {
                                                setNewClass(prevState => ({
                                                    ...prevState,
                                                    price: '0' // Set back to '0' if empty when focus is lost
                                                }));
                                            }
                                        }}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                            setNewClass(prevState => ({
                                                ...prevState,
                                                price: numericValue
                                            }));
                                        }}
                                        className="modal-input"
                                        placeholder="0" // Placeholder shows '0' if the field is empty
                                        inputMode="numeric" // Mobile-friendly numeric keyboard
                                        pattern="[0-9]*"    // Only numeric values allowed
                                    />

                                </div>

                            </div>
                            <div className="input-group">
                                <label>Select Bundle Items</label>
                                <select
                                    name="bundleEquipment"
                                    value=""
                                    onChange={(e) => {
                                        const selectedBundleEquipment = e.target.value;

                                        // Check if the bundle equipment is already selected
                                        if (newClass.bundleEquipment.includes(selectedBundleEquipment)) {
                                            // If it is already selected, remove it
                                            setNewClass(prevState => ({
                                                ...prevState,
                                                bundleEquipment: prevState.bundleEquipment.filter(be => be !== selectedBundleEquipment),
                                            }));
                                        } else {
                                            // Otherwise, add the selected bundle equipment
                                            setNewClass(prevState => ({
                                                ...prevState,
                                                bundleEquipment: [...prevState.bundleEquipment, selectedBundleEquipment],
                                            }));
                                        }
                                    }}
                                    className="modal-input2"
                                >
                                    <option value="">
                                        {newClass.bundleEquipment && newClass.bundleEquipment.length > 0
                                            ? newClass.bundleEquipment.join(', ')
                                            : 'Select Bundle Items'}
                                    </option>
                                    {newClass.equipment.map((equipmentItem, index) => (
                                        <option
                                            key={index}
                                            value={equipmentItem}
                                            style={{
                                                backgroundColor: newClass.bundleEquipment.includes(equipmentItem)
                                                    ? '#e0e0e0' // Highlight selected items in the dropdown
                                                    : 'white',
                                            }}
                                        >
                                            {equipmentItem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeAddModal}>Cancel</button>
                            <button className={`saveModal-button ${isAddButtonDisabled ? 'disabled-button' : ''}`} onClick={handleAddNewClassToScreen} disabled={isAddButtonDisabled}>Add</button>
                        </div>
                    </div>
                </div>
            )}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content2">
                        <div className="modal-header">
                            <h2>Edit Class Code</h2>
                            <button className="close-button" onClick={closeEditModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <label>Code</label>
                                <input type="text" value={editClassData.code} readOnly disabled className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Class</label>
                                    <input type="text" name="className" value={editClassData.className || ''} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" name="professor" value={editClassData.professor || ''} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                            </div>

                            {/* Equipment Dropdown */}
                            <div className="input-group">
                                <label>Select Equipment For This Class</label>
                                <select
                                    name="equipment"
                                    value=""
                                    onChange={(e) => {
                                        const selectedEquipment = e.target.value;

                                        // Check if the equipment is already selected
                                        if (editClassData.equipment.some(eq => eq.itemName === selectedEquipment)) {
                                            // If it is already selected, remove it
                                            setEditClassData(prevState => {
                                                const updatedEquipment = prevState.equipment.filter(eq => eq.itemName !== selectedEquipment);
                                                const updatedBundleEquipment = prevState.bundleEquipment.filter(be => be.itemName !== selectedEquipment);

                                                return {
                                                    ...prevState,
                                                    equipment: updatedEquipment,
                                                    bundleEquipment: updatedBundleEquipment,
                                                };
                                            });
                                        } else {
                                            // Otherwise, add the selected equipment
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                equipment: [...prevState.equipment, { itemName: selectedEquipment, quantity: 1 }],
                                            }));
                                        }
                                    }}
                                    className="modal-input2"
                                >
                                    <option value="">
                                        {editClassData.equipment && editClassData.equipment.length > 0
                                            ? editClassData.equipment.map(eq => eq.itemName).join(', ')
                                            : 'Select Equipment'}
                                    </option>
                                    {availableEquipment.map((equipmentItem) => (
                                        <option
                                            key={equipmentItem._id}
                                            value={equipmentItem.itemName}
                                            style={{
                                                backgroundColor: editClassData.equipment.some(eq => eq.itemName === equipmentItem.itemName)
                                                    ? '#e0e0e0' // Highlight selected items in the dropdown
                                                    : 'white',
                                            }}
                                        >
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            {/* Package/Bundles Section */}
                            <div className="input-group">
                                <label>Package ID</label>
                                <input
                                    type="text"
                                    name="bundleId"
                                    value={editClassData.bundleId || ''} // Set to an empty string if no bundleId
                                    onChange={handleEditClassChange}
                                    className="modal-input"
                                    disabled={hasExistingBundle} // Disable only if there's an existing bundleId
                                />
                            </div>

                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="bundleName" value={editClassData.bundleName || ''} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={editClassData.price === '' || editClassData.price === '0' ? '' : `$${editClassData.price}`} // Show '' when empty or '0'
                                        onFocus={(e) => {
                                            if (editClassData.price === '0') {
                                                setEditClassData(prevState => ({
                                                    ...prevState,
                                                    price: '' // Clear the input when focused if price is '0'
                                                }));
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (editClassData.price === '') {
                                                setEditClassData(prevState => ({
                                                    ...prevState,
                                                    price: '0' // Set back to '0' if empty when focus is lost
                                                }));
                                            }
                                        }}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                price: numericValue
                                            }));
                                        }}
                                        className="modal-input"
                                        placeholder="0" // Placeholder shows '0' if the field is empty
                                        inputMode="numeric" // Mobile-friendly numeric keyboard
                                        pattern="[0-9]*"    // Only numeric values allowed
                                    />
                                </div>

                            </div>

                            {/* Bundle Items Dropdown */}
                            <div className="input-group">
                                <label>Select Bundle Items</label>
                                <select
                                    name="bundleEquipment"
                                    value=""
                                    onChange={(e) => {
                                        const selectedBundleEquipment = e.target.value;

                                        if (editClassData.bundleEquipment.some(be => be.itemName === selectedBundleEquipment)) {
                                            // Remove the selected bundle item
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                bundleEquipment: prevState.bundleEquipment.filter(be => be.itemName !== selectedBundleEquipment),
                                            }));
                                        } else {
                                            // Add the selected bundle item
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                bundleEquipment: [...prevState.bundleEquipment, { itemName: selectedBundleEquipment, quantity: 1 }],
                                            }));
                                        }
                                    }}
                                    className="modal-input2"
                                >
                                    <option value="">
                                        {editClassData.bundleEquipment.length > 0
                                            ? editClassData.bundleEquipment.map(be => be.itemName).join(', ')
                                            : "Select Bundle Items"}
                                    </option>
                                    {editClassData.equipment.map((equipmentItem, index) => (
                                        <option
                                            key={index}
                                            value={equipmentItem.itemName}
                                            style={{
                                                backgroundColor: editClassData.bundleEquipment.some(be => be.itemName === equipmentItem.itemName)
                                                    ? '#e0e0e0'
                                                    : 'white',
                                            }}
                                        >
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeEditModal}>Cancel</button>
                            <button className="saveModal-button" onClick={handleSaveEditedClass}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <DeletePopup
                show={isDeletePopupOpen}
                handleClose={closeDeletePopup}
                handleDelete={handleConfirmDelete}
            />

        </>
    );
}

export default CodesTable;


