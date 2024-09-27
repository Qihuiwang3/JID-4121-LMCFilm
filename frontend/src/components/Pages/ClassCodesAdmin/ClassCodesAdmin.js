import React, { useState, useEffect } from 'react';
import './ClassCodesAdmin.css';
import { useNavigate } from 'react-router-dom';
import { getClassCodes, getBundleItemsByClassCode} from '../../../connector.js';
import BackButton from '../../Button/BackButton/BackButton'; 

function ClassCodesAdmin() {
    const navigate = useNavigate();
    const [classData, setClassData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    // New state for placeholder management
    const [placeholderText, setPlaceholderText] = useState("Search by Class");

    
    // Function to get the package name (bundleName) for each class code
// Function to get the package name (bundleName) for each class code
// Function to get the bundle item for each class code (returning all data)
// Function to fetch bundle item details by class code
const getBundleItemDetails = async (classCode) => {
    try {
        // Fetch bundle items by class code
        const bundleItems = await getBundleItemsByClassCode(classCode);

        // Check if bundleItems exist and access the first bundle item (since bundleItems is an array)
        if (bundleItems && bundleItems.length > 0) {
            const bundleItem = bundleItems[0]; // First bundle item
            return {
                bundleId: bundleItem.bundleId,  // Add bundleId
                classCode: bundleItem.classCode, // Add classCode
                bundleName: bundleItem.bundleName,
                price: bundleItem.price,
                items: bundleItem.items,
                // Add any other fields here that are relevant to the bundle
            };
        } else {
            
            return {
                bundleId: "N/A",
                classCode: classCode, // If no bundle, still show the original classCode
                bundleName: "N/A",
                price: "N/A",
                items: [],
                // Default values for missing data
            };
        }
    } catch (error) {
        
        return {
            bundleId: "N/A",
            classCode: classCode, // Show the original classCode on error
            bundleName: "N/A",
            price: "N/A",
            items: [],
            // Default error handling for missing data
        };
    }
};

// Function to fetch and set the full bundle item details for each class code
const fetchAndSetPackageNames = async (classData) => {
    const updatedClassData = await Promise.all(
        classData.map(async (classItem) => {
            const bundleDetails = await getBundleItemDetails(classItem.code);
            
            // Map additional details from the bundle item to the class item
            return { 
                ...classItem, 
                bundleId: bundleDetails.bundleId,    // Add bundleId field
                classCode: bundleDetails.classCode,  // Add classCode field
                packageName: bundleDetails.bundleName, // Add bundle name
                price: bundleDetails.price,           // Add price field
                items: bundleDetails.items            // Add items array
                // You can add additional fields from bundleItem here
            };
        })
    );
    
    // Update classData with new bundle details
    setClassData(updatedClassData);
};


// In the useEffect or wherever the data is being fetched
useEffect(() => {
    const fetchClassData = async () => {
        try {
            const data = await getClassCodes(); 
            setClassData(data); // Set the class data

            // Fetch and set package names for each class code
            await fetchAndSetPackageNames(data);
        } catch (error) {
            
        }
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
                        <BackButton to="/ViewEquipment" />
                    </div>

            </div>
    );
}

export default ClassCodesAdmin;
