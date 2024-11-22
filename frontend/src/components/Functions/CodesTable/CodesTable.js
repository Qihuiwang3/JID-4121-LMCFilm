import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
import { getClassCodes, createClassCode, createBundleItem, getItems, createSingleItem, deleteClassCode, getBundleItemsByClassCode, updateClassCode, updateBundleItem, getSingleItemsByClassCode, removeSingularItem } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CodesTable.css';
import DeletePopup from "../../Modal/DeletePopupModal/DeletePopup";

const CodesTable = forwardRef((props, ref) => {
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
    
    useImperativeHandle(ref, () => ({
        loadRecords,
    }));


    useEffect(() => {
        loadRecords();
        fetchEquipment();
    }, []);

    const loadRecords = async () => {
        try {
            const classCodes = await getClassCodes();
            const flattenedRecords = await Promise.all(classCodes.map(async (classCode) => {
                try {
                    const bundleData = await getBundleItemsByClassCode(classCode.code);
                    const bundleName = bundleData.bundleName || "N/A";
                    return {
                        code: classCode.code,
                        className: classCode.className,
                        professor: classCode.professor,
                        bundleName: bundleName,
                    };
                } catch (error) {
                    console.error('Error fetching bundle data:', error);
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
        } catch (error) {
            console.error('Error loading records:', error);
        }
    };

    const fetchEquipment = async () => {
        try {
            const equipmentList = await getItems();

            // Filter out items where quantity is less than or equal to zero
            const filteredEquipment = equipmentList.filter(item => item.quantity > 0);

            setAvailableEquipment(filteredEquipment);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
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
            // Create the class code
            await createClassCode({
                code: newEntry.code,
                professor: newEntry.professor,
                className: newEntry.className,
            });
            console.log('Class code created:', newEntry.code);

            // Add single items and build the tempBundle
            const tempBundle = [];
            for (let equipmentItem of newClass.equipment) {
                const tempItem = await createSingleItem({
                    classCode: newEntry.code,
                    itemName: equipmentItem,
                });
                console.log('Single item created:', tempItem);

                if (newClass.bundleEquipment.includes(equipmentItem)) {
                    tempBundle.push({
                        itemName: tempItem.itemName,
                        quantity: 1,
                    });
                }
            }

            // Create bundle item if bundleId and bundleName are provided
            if (newClass.bundleId) {
                await createBundleItem({
                    bundleId: newClass.bundleId,
                    classCode: newEntry.code,
                    items: tempBundle,
                    price: newClass.price,
                    bundleName: newClass.bundleName,
                });
                console.log('Bundle item created:', newClass.bundleName);
            }

            // Reload records after all operations are complete
            await loadRecords();
            console.log('Records reloaded');
        } catch (error) {
            console.error('Error adding new class code:', error);
        }
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
        console.log("Fetched bundle items:", bundleItems); // Debug log

        // Ensure bundleItems.items is an array before mapping
        if (bundleItems.items && Array.isArray(bundleItems.items)) {
            bundleInfo = {
                bundleName: bundleItems.bundleName || 'N/A',
                bundleId: bundleItems.bundleId || '',
                price: bundleItems.price || '',
                bundleEquipment: bundleItems.items.map((item) => {
                    // Ensure itemName exists and log if it doesn't
                    if (!item.itemName) {
                        console.error("Item with missing itemName:", item);
                        return undefined;
                    }
                    return item.itemName; // Map itemName to bundleEquipment
                }),
            };
        }

        setHasExistingBundle(true);
    } catch (error) {
        console.error("Error fetching bundle items:", error);
        setHasExistingBundle(false);
    }

    try {
        singleItems = await getSingleItemsByClassCode(classToEdit.code);
        console.log("Fetched single items:", singleItems); // Debug log
    } catch (error) {
        console.error("Error fetching single items:", error);
    }
    setInitialEquipment(singleItems || []);
    setEditClassData({
        ...classToEdit,
        ...bundleInfo,
        equipment: singleItems || [],
    });

    console.log("Updated editClassData:", {
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
    
            // Determine which equipment items have been removed
            const removedEquipment = initialEquipment.filter(
                initialItem => !editClassData.equipment.some(equipmentItem => equipmentItem.itemName === initialItem.itemName)
            );
    
            // Remove deselected equipment items
            for (const removedItem of removedEquipment) {
                const itemToRemove = initialEquipment.find(item => item.itemName === removedItem.itemName);

                if (itemToRemove && itemToRemove._id) {  // Use the _id field as itemId
                    await removeSingularItem(removedItem.itemName, itemToRemove._id); // Pass _id as itemId
                } else {
                    console.error(`Item ID for ${removedItem.itemName} is undefined. Skipping removal.`);
                }
            }
    
            // Filter out new equipment items that were not part of the initial equipment
            const newEquipment = editClassData.equipment.filter(
                equipmentItem => !initialEquipment.some(initialItem => initialItem.itemName === equipmentItem.itemName)
            );
    
            // Add only unique new items
            const updatedEquipment = [...new Set([...editClassData.equipment])];
            console.log("Items in newEquipment:", newEquipment);

    
            const tempBundle = [];
            for (const equipmentItem of newEquipment) {
                const tempItem = await createSingleItem({
                    classCode: editClassData.code,
                    itemName: equipmentItem.itemName,
                });
                // Add new items to the bundle if they belong to `bundleEquipment`
                if (editClassData.bundleEquipment.includes(equipmentItem.itemName)) {
                    tempBundle.push({
                        itemName: tempItem.itemName,
                        quantity: 1,
                    });
                }
            }
    
            // Use a Set to avoid duplicate bundle items
            const bundleSet = new Set(tempBundle.map(item => item.itemName));
            for (const bundleItem of editClassData.bundleEquipment) {
                if (!bundleSet.has(bundleItem)) {
                    tempBundle.push({ itemName: bundleItem, quantity: 1 });
                    bundleSet.add(bundleItem);
                }
            }
    
            // Create or update bundle
            if (!hasExistingBundle) {
                if (editClassData.bundleName && editClassData.price && tempBundle.length > 0) {
                    const newBundle = await createBundleItem({
                        bundleId: editClassData.bundleId,
                        classCode: editClassData.code,
                        items: tempBundle,
                        price: editClassData.price,
                        bundleName: editClassData.bundleName,
                    });
    
                    setEditClassData(prevState => ({
                        ...prevState,
                        bundleId: newBundle.bundleId,
                    }));
                }
            } else {
                await updateBundleItem({
                    bundleName: editClassData.bundleName,
                    code: editClassData.code,
                    bundleId: editClassData.bundleId,
                    price: editClassData.price,
                    items: tempBundle,
                });
            }
    
            // Update the state with unique equipment
            setEditClassData(prevState => ({
                ...prevState,
                equipment: updatedEquipment,
            }));
    
            // Update records on the frontend
            const updatedRecords = records.map(record =>
                record.code === editClassData.code ? editClassData : record
            );
    
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
                                                const updatedBundleEquipment = prevState.bundleEquipment.filter(be => be !== selectedEquipment);

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
                                    value={editClassData.bundleId || ''}
                                    onChange={handleEditClassChange}
                                    className="modal-input"
                                    disabled={hasExistingBundle}
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
                                        value={editClassData.price === '' || editClassData.price === '0' ? '' : `$${editClassData.price}`}
                                        onFocus={(e) => {
                                            if (editClassData.price === '0') {
                                                setEditClassData(prevState => ({
                                                    ...prevState,
                                                    price: ''
                                                }));
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (editClassData.price === '') {
                                                setEditClassData(prevState => ({
                                                    ...prevState,
                                                    price: '0'
                                                }));
                                            }
                                        }}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                price: numericValue
                                            }));
                                        }}
                                        className="modal-input"
                                        placeholder="0"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
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

                                        if (editClassData.bundleEquipment.includes(selectedBundleEquipment)) {
                                            // Remove the selected bundle item
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                bundleEquipment: prevState.bundleEquipment.filter(be => be !== selectedBundleEquipment),
                                            }));
                                        } else {
                                            // Add the selected bundle item
                                            setEditClassData(prevState => ({
                                                ...prevState,
                                                bundleEquipment: [...prevState.bundleEquipment, selectedBundleEquipment],
                                            }));
                                        }
                                    }}
                                    className="modal-input2"
                                >
                                    <option value="">
                                        {editClassData.bundleEquipment.length > 0
                                            ? editClassData.bundleEquipment.join(', ')
                                            : "Select Bundle Items"}
                                    </option>
                                    {editClassData.equipment.map((equipmentItem, index) => (
                                        <option
                                            key={index}
                                            value={equipmentItem.itemName}
                                            style={{
                                                backgroundColor: editClassData.bundleEquipment.includes(equipmentItem.itemName)
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
});

export default CodesTable;
