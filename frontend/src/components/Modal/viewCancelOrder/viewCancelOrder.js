import React, { useState, useEffect } from 'react';
import './viewCancelOrder.css';
import { deleteOrder } from '../../../connector.js';




    const ViewCancelOrder = ({ show, orderNumber, handleClose, onOrderCancelled }) => {


        const cancelOrder = async (orderNumberDelete) => {
            await deleteOrder(orderNumberDelete);
            onOrderCancelled();
            handleClose();
        }
    
        if (!show) {
            return null;
        }
    
    
    return (
    
    
    <div className="modal-overlay">
        <div className="modal-content3">
            <div className="modal-header">
                <h2>Cancel Order?</h2>
            </div>
            <div className="report-details">
                <button className="cancel-reservation2" onClick={() => cancelOrder(orderNumber)}>Yes</button>
                <button className="cancel-reservation2" onClick={handleClose}>No</button>
            </div>
        </div>
    </div>
    
    
    
    
    
    
    );
    
    
    }
    
    
    export default ViewCancelOrder;
    

