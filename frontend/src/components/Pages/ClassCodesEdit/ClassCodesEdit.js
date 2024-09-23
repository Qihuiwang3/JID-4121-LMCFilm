
import React, { useState } from 'react';
import './ClassCodesEdit.css';
import { useNavigate, useLocation } from 'react-router-dom';

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

    const [classData, setClassData] = useState([
        { id: 1, class: 'LMC 3890 A', code: 7685, professor: 'John Thornton', packageName: "Pack" },
        { id: 2, class: 'LMC 3890 B', code: 8732, professor: 'John Thornton', packageName: "Pack" },
        { id: 3, class: 'LMC 2340 A', code: 9372, professor: 'John Thornton', packageName: "Pack" },
        { id: 4, class: 'LMC 2340 B', code: 2934, professor: 'John Thornton', packageName: "Pack" },
        { id: 5, class: 'Buzz Studio', code: 3927, professor: 'John Thornton', packageName: "Pack" },
        { id: 6, class: 'LMC 2340 B', code: 2934, professor: 'John Thornton', packageName: "Pack" },
        { id: 7, class: 'Buzz Studio', code: 3927, professor: 'John Thornton', packageName: "Pack" }
        
        
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);


    const [newClass, setNewClass] = useState({
        class: '',
        professor: '',
        equipment: '',
        packageID: '',
        packageName: '',
        price: '',
        itemsInsidePackage: ''
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
}

    const [editId, setEditId] = useState(null); 
    const [editedClass, setEditedClass] = useState(""); 

    const totalPages = Math.max(1, Math.ceil(classData.length / rowsPerPage));

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = classData.slice(indexOfFirstRow, indexOfLastRow);

    
    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const handleDeleteRow = (id) => {
        
        const updatedClassData = classData.filter(item => item.id !== id); 
        setClassData(updatedClassData); 
    
        
        const remainingRowsOnPage = updatedClassData.slice(indexOfFirstRow, indexOfLastRow);
        
        if (remainingRowsOnPage.length === 0 && currentPage > 1) {
           
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    
    

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    
    const handleEditClick = (id, className) => {
        setEditId(id);
        setEditedClass(className);
    };

    
    const handleSaveNewClass = () => {
        const newEntry = {
            id: classData.length + 1,  
            class: newClass.class,
            code: generatedCode,
            professor: newClass.professor,
            packageName: newClass.packageName
        };
    
        
        setClassData([...classData, newEntry]);
    
        
        setNewClass({
            class: '',
            professor: '',
            packageName: ''
        });
    
        
        setIsModalOpen(false);
    };
    

   
    const handleSave = () => {
        navigate("/ClassCodesAdmin", {
            state: { classData }
        });
    };

    const handleCancel = () => {
        navigate("/ClassCodesAdmin");
    }

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
                                    {editId === item.id ? (
                                        <input
                                            type="text"
                                            value={editedClass}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <>
                                            {item.class}
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                                                alt="Edit"
                                                className="edit-icon"
                                                onClick={() => handleEditClick(item.id, item.class)}
                                                style={{ marginLeft: '10px', cursor: 'pointer', width: '20px' }}
                                            />
                                        </>
                                    )}
                                    {editId === item.id && (
                                        <button className="saveIn-button-inline" onClick={() => handleSave(item.id)}>
                                            Save
                                        </button>
                                    )}
                                </td>
                                <td>{item.code}</td>
                                <td>{item.professor}</td>
                                <td>{item.PackageName || "Pack"}</td>
                                <td>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                                        alt="Delete"
                                        className="delete-icon"
                                        onClick={() => handleDeleteRow(item.id)} 
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
                <button className="cancel-button"onClick={handleCancel}>Cancel</button>
                <button className="save-button"onClick={handleSave}>Save</button>
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
                                    <input type="text" name="class" value={newClass.class} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input type="text" name="professor" value={newClass.professor} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Select Equipment for the Class</label>
                                <input type="text" name="equipment" value={newClass.equipment} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label>Package ID</label>
                                <input type="text" name="packageID" value={newClass.packageID} onChange={handleInputChange} />
                            </div>
                            <div className="input-group-row">
                                <div className="input-group">
                                    <label>Package Name</label>
                                    <input type="text" name="packageName" value={newClass.packageName} onChange={handleInputChange} />
                                </div>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input type="text" name="price" value={newClass.price} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Items Inside Package</label>
                                <input type="text" name="itemsInsidePackage" value={newClass.itemsInsidePackage} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancelModal-button" onClick={closeModal}>Cancel</button>
                            <button className="saveModal-button" onClick={handleSaveNewClass}>Add</button>
                        </div>
                    </div>
                </div>
            )}       
        </div>
        
        
    );
}

export default ClassCodesEdit;
