import React, { useState, useEffect, useRef } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';
import SearchPopupCheckin from '../SearchPopup/SearchPopupCheckin';
import { getOrderByOrderNumber } from '../../../connector';

const ScanPopup = ({ onClose }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [showCheckinPopup, setShowCheckinPopup] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const [isOrderNumberValid, setIsOrderNumberValid] = useState(false);
    const [orderNotFound, setOrderNotFound] = useState(false);
    const inputRef = useRef(null);

    const handleSearchClick = () => {
        if (orderInfo && isOrderNumberValid) {
            if (!orderInfo.checkedinStatus && !orderInfo.checkedoutStatus) {
                setShowSearchPopup(true);
            } else if (orderInfo.checkedoutStatus && !orderInfo.checkedinStatus) {
                setShowCheckinPopup(true);
            }
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
        setShowCheckinPopup(false);
    };

    const closeAllModals = () => {
        setShowSearchPopup(false);
        setShowCheckinPopup(false);
        onClose();
    };

    const handleOrderNumberChange = (e) => {
        setOrderNumber(e.target.value);
        setIsOrderNumberValid(false);
        setOrderNotFound(false);
    };

    const handleOrderNumberBlur = async () => {
        try {
            if (orderNumber) {
                const fetchedOrderInfo = await getOrderByOrderNumber(orderNumber);
                if (fetchedOrderInfo) {
                    setOrderInfo(fetchedOrderInfo);
                    setIsOrderNumberValid(true);
                    setOrderNotFound(false);
                } else {
                    setIsOrderNumberValid(false);
                    setOrderNotFound(true);
                }
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setIsOrderNumberValid(false);
            setOrderNotFound(true);
        }
    };

    const renderCompletionMessage = () => {
        if (orderInfo?.checkedinStatus && orderInfo?.checkedoutStatus) {
            return <p className="scan-error-message">This order is complete.</p>;
        }
        return null;
    };

    return (
        <div className="scan-modal-overlay" onClick={onClose}>
            <div className="scan-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="scan-modal-header">
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
                        ref={inputRef}
                    />
                    {orderNotFound && <p className="scan-error-message">Order Number is invalid.</p>}
                </div>

                {isOrderNumberValid && renderCompletionMessage()}

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button
                        className="scan-search-button"
                        onClick={handleSearchClick}
                        disabled={!isOrderNumberValid || (orderInfo?.checkedinStatus && orderInfo?.checkedoutStatus)}
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
