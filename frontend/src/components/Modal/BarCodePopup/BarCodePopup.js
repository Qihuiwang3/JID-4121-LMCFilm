import React, { useState, useEffect } from 'react';
import './BarCodePopup.css';
import Barcode from 'react-barcode';
import { getOrderByOrderNumber } from '../../../connector.js';




const BarCodePopup = ({ show, orderNumber, handleClose}) => {
    const [orderNum, setOrderNumber] = useState('');


    useEffect(() => {
        const fetchOrders= async () => {
            try {
                //orderNumber should be passed in here. This is a test placeholder
                const num = await getOrderByOrderNumber(orderNumber);
                setOrderNumber(num);
            } catch (error) {


            }
        };
        fetchOrders();
    }, []);




    if (!show) {
        return null;
    }


return (


<div className="modal-overlay">
    <div className="modal-contentB">
        <div className="modal-header">
            <h2>View Damage Report</h2>
            <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="report-details">
            <p>Please show the attached QR code to the staff member when you arrive. When returning equipment after use, please show this QR code again.</p>


            <div className="barcode-container">
                <Barcode value={orderNum} displayValue={false}  />
            </div>
        </div>
        <div className="modal-footer">
            <button className="cancelModal-button" onClick={handleClose}>Cancel</button>
            <button className="saveModal-button" onClick={handleClose}>Done</button>
        </div>
    </div>
</div>






);


}


export default BarCodePopup;

