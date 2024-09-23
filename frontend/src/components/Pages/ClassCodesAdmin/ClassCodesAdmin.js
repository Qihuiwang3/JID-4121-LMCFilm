import React, { useState } from 'react';
import './ClassCodesAdmin.css';
import { useNavigate } from 'react-router-dom';

function ClassCodesAdmin() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(''); // State to track the search query
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const [classData, setClassData] = useState([
        { id: 1, class: 'LMC 3890 A', code: 7685, professor: 'John Thornton', PackageName: "Pack" },
        { id: 2, class: 'LMC 3890 B', code: 8732, professor: 'John Thornton', PackageName: "Pack" },
        { id: 3, class: 'LMC 2340 A', code: 9372, professor: 'John Thornton', PackageName: "Pack" },
        { id: 4, class: 'LMC 2340 B', code: 2934, professor: 'John Thornton', PackageName: "Pack" },
        { id: 5, class: 'Buzz Studio', code: 3927, professor: 'John Thornton', PackageName: "Pack" },
        { id: 6, class: 'LMC 2340 B', code: 2934, professor: 'John Thornton', PackageName: "Pack" },
        { id: 7, class: 'Buzz Studio', code: 3927, professor: 'John Thornton', PackageName: "Pack" }
    ]);

    // Filter the class data based on the search query
    const filteredClassData = classData.filter((item) =>
        item.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredClassData.length / rowsPerPage));
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredClassData.slice(indexOfFirstRow, indexOfLastRow);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // Handle input change for the search query
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle Edit Class navigation (if needed)
    const handleEditClass = () => {
        navigate("/ClassCodesEdit", { state: { classData } });
    };

    return (
        <div className="content-container">
            <h2 className="section-title">Class Code</h2>

            <div className="top-buttons">
                {/* Search Input Field */}
                <div className="search-class-container">
                    <input
                        type="text"
                        className="search-class-input"
                        placeholder="Search by Class"
                        value={searchQuery}
                        onChange={handleSearchChange} // Trigger search on input change
                    />
                    <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="Search Icon" />
                </div>

                {/* Edit Button */}
                <button className="edit-button" onClick={handleEditClass}>
                    Edit
                    <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Pencil Icon" />
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
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.length > 0 ? (
                            currentRows.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.class}</td>
                                    <td>{item.code}</td>
                                    <td>{item.professor}</td>
                                    <td>{item.PackageName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    No results found.
                                </td>
                            </tr>
                        )}
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
        </div>
    );
}

export default ClassCodesAdmin;
