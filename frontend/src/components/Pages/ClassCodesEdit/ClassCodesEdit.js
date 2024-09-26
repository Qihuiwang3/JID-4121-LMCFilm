import React, { useState } from 'react';
import './ClassCodesEdit.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import { createClassCode, deleteClassCode, updateClassCode } from '../../../connector.js';
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

    // State to keep track of newly added classes that aren't saved to the database yet
    const [newClassData, setNewClassData] = useState([]);
    const [deletedClassCodes, setDeletedClassCodes] = useState([]); 

    const [newClass, setNewClass] = useState({
        class: '',
        professor: '',
        packageName: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClass(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const openModal = () => {
        const randomCode = generateRandomCode();
        setGeneratedCode(randomCode);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setNewClass({
            class: '',
            professor: '',
            packageName: ''
        });
        setIsModalOpen(false);
    };

    const [editedClass, setEditedClass] = useState("");
    const validClassData = classData.filter(item => item.className && item.code && item.professor);
    const totalPages = Math.max(1, Math.ceil(validClassData.length / rowsPerPage));

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = validClassData.slice(indexOfFirstRow, indexOfLastRow);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleDeleteRow = (code) => {
        // Mark the class code for deletion
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

    const handleEditClick = (code, className) => {
        setEditCode(code);
        setEditedClass(className);
    };

    const handleAddNewClassToScreen = () => {
        const newEntry = {
            code: generatedCode,
            className: newClass.class,
            professor: newClass.professor,
            packageName: newClass.packageName
        };

        setClassData([...classData, newEntry]);
        setNewClassData([...newClassData, newEntry]);

        setNewClass({
            className: '',
            professor: '',
            packageName: ''
        });

        setIsModalOpen(false);
    };

    // Send new classes to the backend when "Save" is clicked on the main screen
    const handleSaveToBackend = async () => {
        try {
            for (let newClass of newClassData) {
                await createClassCode({
                    code: newClass.code,
                    professor: newClass.professor,
                    className: newClass.className,
                    packageName: newClass.packageName
                });
            }
            setNewClassData([]);
        } catch (error) {  
        }

        try {
            // Delete all marked class codes
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
    const [editCode, setEditCode] = useState(null);

    const handleSave = (code) => {
        const updatedClass = classData.map((row) =>
            row.code === code ? { ...row, className: editedClass } : row
        );

        setClassData(updatedClass);

        setPendingUpdates([...pendingUpdates, { code, className: editedClass }]);

        setEditCode(null);
    };

    return (
        <div className="content-container">
            <h2 className="section-title">Edit Class Code</h2>

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
                                    {editCode === item.code ? (
                                        <input
                                            type="text"
                                            value={editedClass}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                                                alt="Edit"
                                                className="edit-icon"
                                                onClick={() => handleEditClick(item.code, item.className)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', width: '20px' }}
                                            />
                                            {item.className}
                                        </>
                                    )}
                                    {editCode === item.code && (
                                        <button className="saveIn-button-inline" onClick={() => handleSave(item.code)}>
                                            Save
                                        </button>
                                    )}
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

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Class</h2>
                            <button className="close-button" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="disabled-group">
                                <label>Code</label>
                                <input type="text" value={generatedCode} readOnly disabled />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Class</label>
                                    <input type="text" name="class" value={newClass.className} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" name="professor" value={newClass.professor} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Package Name</label>
                                <input type="text" name="packageName" value={newClass.packageName} onChange={handleInputChange} />
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
