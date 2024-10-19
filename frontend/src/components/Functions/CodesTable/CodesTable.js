import React, { useEffect, useState } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
import { getClassCodes, createClassCode, createBundleItem, getItems, createSingleItem, deleteClassCode, getBundleItemsByClassCode, updateClassCode, updateBundleItem, getSingleItemsByClassCode } from '../../../connector.js';
import SearchBar from '../SearchBar/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './CodesTable.css';

function CodesTable() {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [availableEquipment, setAvailableEquipment] = useState([]);
    const [initialEquipment, setInitialEquipment] = useState([]);

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
        } catch (error) {}
    };

    const fetchEquipment = async () => {
        try {
            const equipmentList = await getItems();
            setAvailableEquipment(equipmentList);
        } catch (error) {}
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
        } catch (error) {}
        closeAddModal();
    };

    

    const handleDeleteRow = async (code) => {
        try {
            await deleteClassCode(code);
            setRecords(records.filter((record) => record.code !== code));
            setFilteredRecords(filteredRecords.filter((record) => record.code !== code));
        } catch (error) {}
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
            }
        } catch (error) {}
        try {
            singleItems = await getSingleItemsByClassCode(classToEdit.code);
        } catch (error) {}
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
            await updateClassCode(editClassData);
            const newEquipment = editClassData.equipment.filter(equipmentItem => {
                return !initialEquipment.find(initialItem => initialItem.itemName === equipmentItem.itemName);
            });
            for (const equipmentItem of newEquipment) {
                await createSingleItem({
                    classCode: editClassData.code,
                    itemName: equipmentItem.itemName,
                });
            }
            if (editClassData.bundleId || editClassData.price) {
                const updatedBundleItems = editClassData.bundleEquipment.map(be => ({
                    itemName: be.itemName,
                    quantity: 1,
                }));
                await updateBundleItem({
                    bundleName: editClassData.bundleName,
                    code: editClassData.code,
                    bundleId: editClassData.bundleId,
                    price: editClassData.price,
                    items: updatedBundleItems,
                });
            }
            const updatedRecords = records.map(item => {
                return item.code === editClassData.code ? editClassData : item;
            });
            setRecords(updatedRecords);
            setFilteredRecords(updatedRecords);
            closeEditModal();
        } catch (error) {}
    };

    const columnDefs = [
        { headerName: "Class", field: "className", flex: 1, cellRenderer: params => (
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
        )},
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
                                <select name="equipment" value="" onChange={(e) => {
                                    const selectedEquipment = e.target.value;
                                    if (selectedEquipment && !newClass.equipment.includes(selectedEquipment)) {
                                        setNewClass(prevState => ({
                                            ...prevState,
                                            equipment: [...prevState.equipment, selectedEquipment],
                                        }));
                                    }
                                }} className="modal-input">
                                    <option value="">Select Equipment</option>
                                    {availableEquipment.map((equipmentItem) => (
                                        <option key={equipmentItem._id} value={equipmentItem.itemName}>
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="equipmentList" value={newClass.equipment ? newClass.equipment.join(', ') : ''} readOnly className="modal-input" placeholder="Selected equipment will appear here" />
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
                                    <input type="text" name="price" value={newClass.price} onChange={handleInputChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Bundle Items</label>
                                <select name="bundleEquipment" value="" onChange={(e) => {
                                    const selectedBundleEquipment = e.target.value;
                                    if (selectedBundleEquipment && !newClass.bundleEquipment.includes(selectedBundleEquipment)) {
                                        setNewClass(prevState => ({
                                            ...prevState,
                                            bundleEquipment: [...prevState.bundleEquipment, selectedBundleEquipment],
                                        }));
                                    }
                                }} className="modal-input">
                                    <option value="">Select Bundle Items</option>
                                    {newClass.equipment.map((equipmentItem, index) => (
                                        <option key={index} value={equipmentItem}>
                                            {equipmentItem}
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="bundleEquipmentList" value={newClass.bundleEquipment ? newClass.bundleEquipment.join(', ') : ''} readOnly className="modal-input" placeholder="Selected bundle items will appear here" />
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
                            <div className="input-group">
                                <label>Select Equipment For This Class</label>
                                <select name="equipment" value="" onChange={(e) => {
                                    const selectedEquipment = e.target.value;
                                    if (selectedEquipment && !editClassData.equipment.find(eq => eq.itemName === selectedEquipment)) {
                                        setEditClassData(prevState => ({
                                            ...prevState,
                                            equipment: [...prevState.equipment, { itemName: selectedEquipment, quantity: 1 }],
                                        }));
                                    }
                                }} className="modal-input">
                                    <option value="">Select Equipment</option>
                                    {availableEquipment.map((equipmentItem) => (
                                        <option key={equipmentItem._id} value={equipmentItem.itemName}>
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="equipmentList" value={editClassData.equipment ? editClassData.equipment.map(eq => eq.itemName).join(', ') : ''} readOnly className="modal-input" placeholder="Selected equipment will appear here" />
                            </div>
                            <div className="input-group">
                                <label>Package ID</label>
                                <input type="text" name="bundleId" value={editClassData.bundleId || ''} readOnly disabled className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="bundleName" value={editClassData.bundleName || ''} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input type="text" name="price" value={editClassData.price || ''} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Bundle Items</label>
                                <select name="bundleEquipment" value="" onChange={(e) => {
                                    const selectedBundleEquipment = e.target.value;
                                    if (selectedBundleEquipment && !editClassData.bundleEquipment.find(be => be.itemName === selectedBundleEquipment)) {
                                        setEditClassData(prevState => ({
                                            ...prevState,
                                            bundleEquipment: [...prevState.bundleEquipment, { itemName: selectedBundleEquipment, quantity: 1 }],
                                        }));
                                    }
                                }} className="modal-input">
                                    <option value="">Select Bundle Items</option>
                                    {editClassData.equipment.map((equipmentItem, index) => (
                                        <option key={index} value={equipmentItem.itemName}>
                                            {equipmentItem.itemName}
                                        </option>
                                    ))}
                                </select>
                                <input type="text" name="bundleEquipmentList" value={editClassData.bundleEquipment ? editClassData.bundleEquipment.map(be => be.itemName).join(', ') : ''} readOnly className="modal-input" placeholder="Selected bundle items will appear here" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeEditModal}>Cancel</button>
                            <button className="saveModal-button" onClick={handleSaveEditedClass}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CodesTable;

