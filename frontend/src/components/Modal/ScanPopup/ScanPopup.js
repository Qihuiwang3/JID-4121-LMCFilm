import React, { useState } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';
import { getOrderByOrderNumber } from '../../../connector'; 

const ScanPopup = ({ onClose, selectedOption, onOptionChange }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderInfo, setOrderInfo] = useState(null); 
    const [isOrderNumberValid, setIsOrderNumberValid] = useState(false); 

    const handleSearchClick = () => {
        setShowSearchPopup(true);
    };

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
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
                    console.log(fetchedOrderInfo);
                    setOrderInfo(fetchedOrderInfo);
                    setIsOrderNumberValid(true); 

                    // Automatically select the appropriate radio button based on order status
                    if (!fetchedOrderInfo.checkedInStatus && !fetchedOrderInfo.checkedOutStatus) {
                        onOptionChange({ target: { value: 'checkout' } });
                    } else if (fetchedOrderInfo.checkedOutStatus && !fetchedOrderInfo.checkedInStatus) {
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

    // Determine which UI elements to show based on checkedInStatus and checkedOutStatus
    const renderRadioButtonsOrMessage = () => {
        if (orderInfo && isOrderNumberValid) {
            const { checkedInStatus, checkedOutStatus } = orderInfo;

            if (!checkedInStatus && !checkedOutStatus) {
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

            if (checkedOutStatus && !checkedInStatus) {
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

            if (checkedOutStatus && checkedInStatus) {
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
                    <label htmlFor="barcode">Order Number</label>
                    <input
                        type="text"
                        id="barcode"
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

                {showSearchPopup && <SearchPopup orderInfo={orderInfo} onClose={closeSearchPopup} />}
            </div>
        </div>
    );
};

export default ScanPopup;
