import React, { useState } from 'react';
import './ClassCodesAdmin.css';
import { useNavigate, useLocation } from 'react-router-dom';

function ClassCodesAdmin() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [isDeleteOneOpen, setIsDeleteOneOpen] = useState(false);
    
    const [classData, setClassData] = useState([
        { id: 1, class: 'LMC 3890 A', code: 7685, professor: 'John Thornton' },
        { id: 2, class: 'LMC 3890 B', code: 8732, professor: 'John Thornton' },
        { id: 3, class: 'LMC 2340 A', code: 9372, professor: 'John Thornton' },
        { id: 4, class: 'LMC 2340 B', code: 2934, professor: 'John Thornton' },
        { id: 5, class: 'Buzz Studio', code: 3927, professor: 'John Thornton' },
        { id: 6, class: 'Cap ME', code: 3405, professor: 'Wowzers'},
        { id: 7, class: 'Cap ME', code: 8405, professor: 'Wowzers'}
    ]);

    const [newClass, setNewClass] = useState({
        id: classData.length + 1,
        class: '',
        code: '',
        professor: ''
    });

    const handleDeleteOneRow = (id) => {
        setIsDeleteOneOpen(true);
        const updatedClassData = classData.filter(item => item.id !== id);
        setClassData(updatedClassData);
    };

    const handleDeleteOneCloseModal = () => {
        setIsDeleteOneOpen(false);
    }

    const handleDeleteRowOne = (id) => {
        setIsDeleteOneOpen(false);
        const updatedClassData = classData.filter(item => item.id !== id);
        setClassData(updatedClassData);
    }

    const totalPages = Math.max(1, Math.ceil(classData.length / rowsPerPage));

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = classData.slice(indexOfFirstRow, indexOfLastRow);

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
        setIsModalOpen(false);
    };

    const handleEditClass = () => {
        navigate("/ClassCodesEdit", {
            state: { classData }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClass((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddClassSubmit = () => {
        const newClassEntry = {
            id: classData.length + 1,
            class: newClass.class,
            code: generatedCode,
            professor: newClass.professor
        };
    
        setClassData((prevClassData) => [...prevClassData, newClassEntry]);
    
        setNewClass({ class: '', professor: '' });
        setIsModalOpen(false);
    };

    return (
        <div className="content-container">
            <h2 className="section-title">Class Code</h2>

            <div className="top-buttons">
                <button className="add-class-button" onClick={handleAddClass}>Add New Class</button>
                <button className="edit-button" onClick={handleEditClass}>Edit</button>
            </div>

            <div className="table-container">
                <table className="class-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Code</th>
                            <th>Professors</th>
                            <th>Delete</th>
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
                                    onClick={() => handleDeleteOneRow(item.id)}
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
                <button className="back-button">Back</button>
            </div>

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
                                    <input
                                        type="text"
                                        name="class"
                                        value={newClass.class}
                                        onChange={handleInputChange}
                                        placeholder="Enter class name"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Professor</label>
                                    <input
                                        type="text"
                                        name="professor"
                                        value={newClass.professor}
                                        onChange={handleInputChange}
                                        placeholder="Enter professor's name"
                                    />
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

            {isDeleteOneOpen && (
                <div className="modal-overlay">
                    <div className="modal2-content">
                        <div className="modal2-header">
                            <h2>Attention!</h2>
                        </div>
                        <div className="modal2-body">
                            <h2>You are deleting this information from the database. Are you sure you want to delete it?</h2>
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

export default ClassCodesAdmin;
