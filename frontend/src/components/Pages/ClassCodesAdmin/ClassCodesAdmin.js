import React, { useState, useEffect } from 'react';
import './ClassCodesAdmin.css';
import { useNavigate } from 'react-router-dom';
import { getClassCodes, getBundleItemsByClassCode } from '../../../connector.js';
import BackButton from '../../Button/BackButton/BackButton';

function ClassCodesAdmin() {
    const navigate = useNavigate();
    const [classData, setClassData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [placeholderText, setPlaceholderText] = useState("Search by Class");

    const getBundleItemDetails = async (classCode) => {
        try {
            const bundleItems = await getBundleItemsByClassCode(classCode);
            if (bundleItems && bundleItems.length > 0) {
                const bundleItem = bundleItems[0];
                return {
                    bundleId: bundleItem.bundleId,
                    classCode: bundleItem.classCode,
                    bundleName: bundleItem.bundleName,
                    price: bundleItem.price,
                    items: bundleItem.items,
                };
            } else {
                return {
                    bundleId: "N/A",
                    classCode: classCode,
                    bundleName: "N/A",
                    price: "N/A",
                    items: [],
                };
            }
        } catch (error) {
            return {
                bundleId: "N/A",
                classCode: classCode,
                bundleName: "N/A",
                price: "N/A",
                items: [],
            };
        }
    };

    const fetchAndSetPackageNames = async (classData) => {
        const updatedClassData = await Promise.all(
            classData.map(async (classItem) => {
                const bundleDetails = await getBundleItemDetails(classItem.code);
                return {
                    ...classItem,
                    bundleId: bundleDetails.bundleId,
                    classCode: bundleDetails.classCode,
                    packageName: bundleDetails.bundleName,
                    price: bundleDetails.price,
                    items: bundleDetails.items,
                };
            })
        );
        setClassData(updatedClassData);
    };

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const data = await getClassCodes();
                setClassData(data);
                await fetchAndSetPackageNames(data);
            } catch (error) {}
        };
        fetchClassData();
    }, []);

    const [filteredClassData, setFilteredClassData] = useState(classData || []);

    useEffect(() => {
        const filteredData = classData.filter((item) => {
            const className = item.className || '';
            return className.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredClassData(filteredData);
        setCurrentPage(1);
    }, [searchQuery, classData]);

    const validClassData = filteredClassData.filter(item => item.className && item.code && item.professor);
    const totalPages = Math.max(1, Math.ceil(validClassData.length / rowsPerPage));
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = validClassData.slice(indexOfFirstRow, indexOfLastRow);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleFocus = () => {
        setPlaceholderText("");
    };

    const handleBlur = () => {
        setSearchQuery('');
        setPlaceholderText("Search by Class");
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEditClass = () => {
        navigate("/ClassCodesEdit", { state: { classData } });
    };

    return (
        <div className="content-container">
            <h2 className="section-title">Class Code</h2>
            <div className="top-buttons">
                <div className="search-class-container">
                    <input
                        type="text"
                        className="search-class-input"
                        placeholder={placeholderText}
                        value={searchQuery}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleSearchChange}
                    />
                    <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="Search Icon" />
                </div>
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
                                    <td>{item.className}</td>
                                    <td>{item.code}</td>
                                    <td>{item.professor}</td>
                                    <td>{item.packageName ? item.packageName : "Cap"}</td>
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
            <div className="bottom-btn-container">
                <BackButton to="/Management" />
            </div>
        </div>
    );
}

export default ClassCodesAdmin;
