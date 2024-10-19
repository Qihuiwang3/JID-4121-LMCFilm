import React, { useState } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';
import { getOrderByOrderNumber } from '../../../connector'; 

const ScanPopup = ({ onClose, selectedOption, onOptionChange }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderInfo, setOrderInfo] = useState(null); 

    const handleSearchClick = () => {
        setShowSearchPopup(true);
    };

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
    };

    const handleOrderNumberChange = (e) => {
        setOrderNumber(e.target.value);
    };

    const handleOrderNumberBlur = async () => {
        try {
            if (orderNumber) {
                const fetchedOrderInfo = await getOrderByOrderNumber(orderNumber);
                console.log(fetchedOrderInfo)
                setOrderInfo(fetchedOrderInfo);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Scan</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="scan-input">
                    <label htmlFor="barcode">Order Number</label>
                    <input
                        type="text"
                        id="barcode"
                        className="checkout-modal-input"
                        value={orderNumber}
                        onChange={handleOrderNumberChange}
                        onBlur={handleOrderNumberBlur} // Trigger API call when user clicks away
                    />
                </div>
                <div className="radio-input">
                    <label>
                        <input
                            type="radio"
                            value="checkout"
                            checked={selectedOption === 'checkout'}
                            onChange={onOptionChange}
                        />
                        Equipment Check Out
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="checkin"
                            checked={selectedOption === 'checkin'}
                            onChange={onOptionChange}
                        />
                        Equipment Check In
                    </label>
                </div>

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button className="scan-search-button" onClick={handleSearchClick}>
                        Search
                    </button>
                </div>

                {showSearchPopup && <SearchPopup orderInfo={orderInfo} onClose={closeSearchPopup} />}
            </div>
        </div>
    );
};

export default ScanPopup;
