import React, { useState } from 'react';
import './ClassCodesEdit.css';
import { useNavigate, useLocation } from 'react-router-dom';


function ClassCodesEdit() {
    let va = 10;
    const location = useLocation();
    const navigate = useNavigate();
    const { classData: initialClassData } = location.state || {};
    
    const [classData, setClassData] = useState(initialClassData || []);

   
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteOneOpen, setIsDeleteOneOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    const [currentPage, setCurrentPage] = useState(1); 
    const rowsPerPage = 5; 

   


    const totalPages = Math.max(1, Math.ceil(classData.length / rowsPerPage));

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = classData.slice(indexOfFirstRow, indexOfLastRow);

    const [newClass, setNewClass] = useState({
        id: classData.length + 1, 
        class: '',
        code: '',
        professor: ''
    });

    const handleDeleteRow = (id) => {
        setIsDeleteOneOpen(true);
        va = id;
        const updatedClassData = classData.filter(item => item.id !== va); 
        setClassData(updatedClassData); 
    };

    const handleDeleteRowOne = (id) => {
        setIsDeleteOneOpen(false);
        const updatedClassData = classData.filter(item => item.id !== va); 
        setClassData(updatedClassData); 
    }

    // Handle page change
    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };


    
    const handleAddClass = () => {
        const randomCode = Math.floor(1000 + Math.random() * 9000); 
        setGeneratedCode(randomCode);
        setIsModalOpen(true); 
    };

    
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    


    const handleClear = () => {
        setIsDeleteOpen(true);
    }

    const clearAll = () => {
        setIsDeleteOpen(false);
        setClassData([]);
    }

    const handleDeleteCloseModal = () => {
        setIsDeleteOpen(false);
    }
    const handleDeleteOneCloseModal = () => {
        setIsDeleteOneOpen(false);
    }
    const handleSave = () => {
        navigate("/ClassCodesAdmin", {
            state: { classData } // Pass the full classData array
        });
    };

    const handleAddClassSubmit = () => {
        const newClassEntry = {
            id: classData.length + 1,
            class: newClass.class,
            code: generatedCode,  // Use the currently generated code
            professor: newClass.professor
        };
    
        // Update classData with the new class entry
        setClassData((prevClassData) => [...prevClassData, newClassEntry]);
    
        
        setNewClass({ class: '', professor: '' }); 
        setIsModalOpen(false); 
    };

   

    return (
        <div className="content-container">
            <h2 className="section-title">Class Code</h2>

            <div className="top-buttons">
                <button className="add-class-button" onClick={handleAddClass}>Add New Class</button>
            </div>

            <div className="table-container">
                <table className="class-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Code</th>
                            <th>Professors</th>
                            <th>Delete</th> {/* Delete column is the last one */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item, index) => (
                            <tr key={index}>
                                <td>{item.class}</td>
                                <td>{item.code}</td>
                                <td>{item.professor}</td>
                                <td>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                                    alt="Delete"
                                     className="delete-icon"
                                     onClick={() => handleDeleteRow(item.id)} // Call delete function with the item's id
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
                        &lt;&lt;
                    </button>
                    <span className="pagination-text">{`${currentPage}/${totalPages}`}</span>
                    <button
                        className="pagination-button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>

            <div className="bottom-buttons">
                <button className="clear-button" onClick={handleClear}>Clear-All</button>
                <button className="save-button" onClick={handleSave}>Save</button>
            </div>

            {/* Modal for adding new class */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Class</h2>
                            <button className="close-button" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <label>Code</label>
                                <input type="text" value={generatedCode} readOnly />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Class</label>
                                    <input type="text" placeholder="Enter class" />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" placeholder="Enter professor" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                            <button className="submit-button" onClick={handleAddClassSubmit}>Add Class</button>
                        </div>
                    </div>
                </div>
            )}

             {/* Modal for adding new class */}
             {isDeleteOpen && (
                <div className="modal-overlay">
                    <div className="modal2-content">
                        <div className="modal2-header">
                            <h2>Attention!</h2>
                        </div>
                        <div className="modal2-body">
                            <h2>Clearing out all information from the database will result in serious consequences if this is not what you intend. Are you sure you want to delete it?</h2>
                        </div>
                        <div className="modal-footer">
                            <button className="submit-button" onClick={handleDeleteCloseModal}>Cancel</button>
                            <button className="submit-button" onClick={clearAll}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal for deleting class */}
            {isDeleteOneOpen && (
                <div className="modal-overlay">
                    <div className="modal2-content">
                        <div className="modal2-header">
                            <h2>Attention!</h2>
                        </div>
                        <div className="modal2-body">
                            <h2>You are about to delete this information from the database. Are you sure you want to delete it?</h2>
                        </div>
                        <div className="modal-footer">
                            <button className="submit-button" onClick={handleDeleteOneCloseModal}>Cancel</button>
                            <button className="submit-button" onClick={handleDeleteRowOne}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClassCodesEdit;
