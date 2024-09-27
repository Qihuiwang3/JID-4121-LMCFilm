import React, { useState } from 'react';
import './ClassCodesEdit.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClassCode, deleteClassCode, updateClassCode, createBundleItem } from '../../../connector.js';
import SaveButton from '../../Button/SaveButton/SaveButton.js';

function ClassCodesEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const { classData: initialClassData } = location.state || {};
    const [generatedCode, setGeneratedCode] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const generateRandomCode = () => {
        return Math.floor(1000 + Math.random() * 9000);
    };

    const [classData, setClassData] = useState(initialClassData || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClassData, setNewClassData] = useState([]);
    const [deletedClassCodes, setDeletedClassCodes] = useState([]);

    const [newClass, setNewClass] = useState({
        className: '',
        professor: '',
        bundleId: '',
        packageName: '',
        price: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "price") {
            setNewClass(prevState => ({
                ...prevState,
                [name]: Number(value)
            }));
        } else {
            setNewClass(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const openModal = () => {
        const randomCode = generateRandomCode();
        setGeneratedCode(randomCode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setNewClass({
            className: '',
            professor: '',
            packageName: '',
            price: '',
            bundleId: '',
        });
        setIsModalOpen(false);
    };

    const validClassData = classData.filter(item => item.className && item.code && item.professor);
    const totalPages = Math.max(1, Math.ceil(validClassData.length / rowsPerPage));
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = validClassData.slice(indexOfFirstRow, indexOfLastRow);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleDeleteRow = (code) => {
        setDeletedClassCodes([...deletedClassCodes, code]);
        const updatedClassData = classData.filter(item => item.code !== code);
        setClassData(updatedClassData);
        const remainingRowsOnPage = updatedClassData.slice(indexOfFirstRow, indexOfLastRow);
        if (remainingRowsOnPage.length === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleAddNewClassToScreen = () => {
        const newEntry = {
            code: generatedCode,
            className: newClass.className,
            professor: newClass.professor,
            packageName: newClass.packageName,
            price: newClass.price,
            bundleId: newClass.bundleId,
        };
        setClassData([...classData, newEntry]);
        setNewClassData([...newClassData, newEntry]);
        setNewClass({
            className: '',
            professor: '',
            bundleId: '',
            packageName: '',
            price: '',
        });
        setIsModalOpen(false);
    };

    const handleSaveToBackend = async () => {
        try {
            for (let newClass of newClassData) {
                await createClassCode({
                    code: newClass.code,
                    professor: newClass.professor,
                    className: newClass.className,
                });
                if (newClass.code && newClass.bundleId && newClass.bundleName && newClass.price) {
                    await createBundleItem({
                        bundleId: newClass.bundleId,
                        classCode: newClass.code,
                        price: newClass.price,
                        bundleName: newClass.packageName,
                    });
                }
            }
            setNewClassData([]);
        } catch (error) {
            console.error('Error saving class codes or bundle items:', error);
        }

        try {
            for (const code of deletedClassCodes) {
                await deleteClassCode(code);
            }
            setDeletedClassCodes([]);
        } catch (error) {
           
        }

        try {
            const updatePromises = pendingUpdates.map((updatedClass) =>
                updateClassCode(updatedClass)
            );
            await Promise.all(updatePromises);
            setPendingUpdates([]);
        } catch (error) {
           
        }

        navigate("/ClassCodesAdmin", {
            state: { classData }
        });
    };

    const handleCancel = () => {
        navigate("/ClassCodesAdmin");
    };

    const [pendingUpdates, setPendingUpdates] = useState([]);
    const [IsEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editClassData, setEditClassData] = useState({});

    const openEditModal = async (code) => {
        const classToEdit = classData.find((item) => item.code === code);
        setEditClassData(classToEdit);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEditClassChange = (e) => {
        const { name, value } = e.target;
        setEditClassData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveEditedClass = () => {
        const updatedClassDataArray = classData.map((item) =>
            item.code === editClassData.code ? editClassData : item
        );
        setClassData(updatedClassDataArray);
        setPendingUpdates([...pendingUpdates, editClassData]);
        setIsEditModalOpen(false);
    };

    return (
        <div className="content-container">
            <h2 className="section1-title">Edit Class Code</h2>
            <div className="top-buttons">
                <button className="add-class-button" onClick={openModal}>
                    Add New <span className="plus-icon">+</span>
                </button>
            </div>
            <div className="table-container">
                <table className="class1-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Code</th>
                            <th>Professors</th>
                            <th>Package</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                                        alt="Edit"
                                        className="edit-icon"
                                        onClick={() => openEditModal(item.code)}
                                        style={{ marginLeft: '10px', cursor: 'pointer', width: '20px' }}
                                    />
                                    {item.className}
                                </td>
                                <td>{item.code}</td>
                                <td>{item.professor}</td>
                                <td>{item.packageName || "N/A"}</td>
                                <td>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                                        alt="Delete"
                                        className="delete-icon"
                                        onClick={() => handleDeleteRow(item.code)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                    >
                        I&#9664;
                    </button>
                    <span className="pagination-text">{`${currentPage}/${totalPages}`}</span>
                    <button
                        className="pagination-button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                    >
                        &#9654;I
                    </button>
                </div>
            </div>
            <div className="bottom-buttons">
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <SaveButton onClick={handleSaveToBackend} />
            </div>
            {IsEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit</h2>
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
                                    <input type="text" name="className" value={editClassData.className} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" name="professor" value={editClassData.professor} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Equipment For This Class</label>
                                <input type="text" name="equipment" value={editClassData.equipment} onChange={handleEditClassChange} className="modal-input" />
                            </div>
                            <div className="input-group">
                                <label>Package ID</label>
                                <input type="text" name="bundleId" value={editClassData.bundleId} onChange={handleEditClassChange} className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="packageName" value={editClassData.packageName} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input type="text" name="price" value={editClassData.price} onChange={handleEditClassChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Items Inside the Package</label>
                                <input type="text" name="itemsInsidePackage" value={editClassData.items} onChange={handleEditClassChange} className="modal-input" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeEditModal}>Cancel</button>
                            <button className="saveModal-button" onClick={handleSaveEditedClass}>Add</button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New</h2>
                            <button className="close-button" onClick={closeModal}>×</button>
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
                                <input type="text" name="equipment" value={newClass.equipment} onChange={handleInputChange} className="modal-input" />
                            </div>
                            <div className="input-group">
                                <label>Package ID</label>
                                <input type="text" name="bundleId" value={newClass.bundleId} onChange={handleInputChange} className="modal-input" />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="packageName" value={newClass.packageName} onChange={handleInputChange} className="modal-input" />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input type="text" name="price" value={newClass.price} onChange={handleInputChange} className="modal-input" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Items Inside the Package</label>
                                <input type="text" name="itemsInsidePackage" value={newClass.itemsInsidePackage} onChange={handleInputChange} className="modal-input" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeModal}>Cancel</button>
                            <button className="saveModal-button" onClick={handleAddNewClassToScreen}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClassCodesEdit;
