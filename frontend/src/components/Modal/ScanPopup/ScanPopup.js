import React, { useState } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';
import SearchPopupCheckin from '../SearchPopup/SearchPopupCheckin';
import { getOrderByOrderNumber } from '../../../connector'; 

const ScanPopup = ({ onClose, selectedOption, onOptionChange }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showCheckinPopup, setShowCheckinPopup] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderInfo, setOrderInfo] = useState(null); 
    const [isOrderNumberValid, setIsOrderNumberValid] = useState(false); 

    const handleSearchClick = () => {
        if (selectedOption === 'checkout') {
            setShowSearchPopup(true);
        } else if (selectedOption === 'checkin') {
            setShowCheckinPopup(true);
        }
    };

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
        setShowCheckinPopup(false);  // Close both popups when navigating back
    };

    const closeAllModals = () => {
        setShowSearchPopup(false);
        setShowCheckinPopup(false);
        onClose(); // Close parent modal
    };

    const handleOrderNumberChange = (e) => {
        setOrderNumber(e.target.value);
        setIsOrderNumberValid(false);
    };

    const handleOrderNumberBlur = async () => {
        try {
            if (orderNumber) {
                const fetchedOrderInfo = await getOrderByOrderNumber(orderNumber);
                if (fetchedOrderInfo) {
                    setOrderInfo(fetchedOrderInfo);
                    setIsOrderNumberValid(true); 

                    // Automatically select the appropriate radio button based on order status
                    if (!fetchedOrderInfo.checkedinStatus && !fetchedOrderInfo.checkedoutStatus) {
                        onOptionChange({ target: { value: 'checkout' } });
                    } else if (fetchedOrderInfo.checkedoutStatus && !fetchedOrderInfo.checkedinStatus) {
                        onOptionChange({ target: { value: 'checkin' } });
                    }
                } else {
                    setIsOrderNumberValid(false); 
                }
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setIsOrderNumberValid(false); 
        }
    };

    const renderRadioButtonsOrMessage = () => {
        if (orderInfo && isOrderNumberValid) {
            const { checkedinStatus, checkedoutStatus } = orderInfo;

            if (!checkedinStatus && !checkedoutStatus) {
                return (
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
                    </div>
                );
            }

            if (checkedoutStatus && !checkedinStatus) {
                return (
                    <div className="radio-input">
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
                );
            }

            if (checkedoutStatus && checkedinStatus) {
                return <p>This order is complete.</p>;
            }
        }
        return null;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Scan</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="scan-input">
                    <label htmlFor="orderNumber">Order Number</label>
                    <input
                        type="text"
                        id="orderNumber"
                        className="checkout-modal-input"
                        value={orderNumber}
                        onChange={handleOrderNumberChange}
                        onBlur={handleOrderNumberBlur} 
                    />
                </div>

                {isOrderNumberValid && renderRadioButtonsOrMessage()}

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button
                        className={`scan-search-button ${!isOrderNumberValid ? 'disabled-button' : ''}`} 
                        onClick={handleSearchClick}
                        disabled={!isOrderNumberValid} 
                    >
                        Search
                    </button>
                </div>

                {showSearchPopup && <SearchPopup orderInfo={orderInfo} onClose={closeAllModals} goBack={closeSearchPopup} />}
                {showCheckinPopup && <SearchPopupCheckin orderInfo={orderInfo} onClose={closeAllModals} goBack={closeSearchPopup} />}
            </div>
        </div>
    );
};

export default ScanPopup;
