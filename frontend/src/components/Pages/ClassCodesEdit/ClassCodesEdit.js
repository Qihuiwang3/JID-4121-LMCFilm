import React, { useState } from 'react';
import './ClassCodesEdit.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import { createClassCode, deleteClassCode, updateClassCode } from '../../../connector.js';
import BackButton from '../../Button/BackButton/BackButton'; 
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
    const [deletedClassCodes, setDeletedClassCodes] = useState([]); // New state to store deleted codes


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


    const totalPages = Math.max(1, Math.ceil(classData.length / rowsPerPage));


    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = classData.slice(indexOfFirstRow, indexOfLastRow);


    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };


    const handleDeleteRow = (code) => {
        // Mark the class code for deletion
        setDeletedClassCodes([...deletedClassCodes, code]);
   
        // Remove the class from the UI temporarily
        const updatedClassData = classData.filter(item => item.code !== code);
        setClassData(updatedClassData);
   
        // Handle pagination adjustment if needed
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


    // Handle modal "Add" button (add new class but don't save to the database yet)
    const handleAddNewClassToScreen = () => {
        const newEntry = {
            code: generatedCode,  
            className: newClass.class,
            professor: newClass.professor,
            packageName: newClass.packageName
        };


        // Add to classData (for display purposes) and newClassData (to track new entries for backend)
        setClassData([...classData, newEntry]);
        setNewClassData([...newClassData, newEntry]);


        // Reset form fields
        setNewClass({
            className: '',
            professor: '',
            packageName: ''
        });


        // Close the modal
        setIsModalOpen(false);
    };


    // Send new classes to the backend when "Save" is clicked on the main screen
    const handleSaveToBackend = async () => {
        try {
            // Loop through newClassData and call createClassCode for each new class
            for (let newClass of newClassData) {
                await createClassCode({
                    code: newClass.code,
                    professor: newClass.professor,
                    className: newClass.className,
                    packageName: newClass.packageName
                });
            }
   
            // Clear the newClassData array after saving to the backend
            setNewClassData([]);
   
            // Navigate back to the Admin page
           
        } catch (error) {
            console.error("Error saving to backend:", error);
        }


        try {
            // Delete all marked class codes
            for (const code of deletedClassCodes) {
                await deleteClassCode(code); // Use the new deleteClassCode function here
            }
   
            setDeletedClassCodes([]); // Clear deleted list after saving
   
         
        } catch (error) {
            console.error("Error saving class data:", error);
        }


        try {
            const updatePromises = pendingUpdates.map((updatedClass) =>
                updateClassCode(updatedClass) // Call your update function here
            );
            await Promise.all(updatePromises); // Wait for all updates to complete


            setPendingUpdates([]); // Clear pending updates after submission
        } catch (error) {
            console.error("Error updating classes in the database:", error);
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


        // Add to pending updates
        setPendingUpdates([...pendingUpdates, { code, className: editedClass }]);


        // Exit edit mode
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
                <table className="class-table">
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
                                            {item.className}
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                                                alt="Edit"
                                                className="edit-icon"
                                                onClick={() => handleEditClick(item.code, item.className)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', width: '20px' }}
                                            />
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
                                <td>{item.packageName || "Pack"}</td>
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
                <BackButton to="/ClassCodesAdmin" />
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


