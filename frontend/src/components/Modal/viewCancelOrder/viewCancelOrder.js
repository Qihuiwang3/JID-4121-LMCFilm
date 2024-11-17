import React from 'react';
import './viewCancelOrder.css';
import { deleteOrder } from '../../../connector';

const ViewCancelOrder = ({ show, orderNumber, handleClose, canCancelOrder, onOrderCancelled }) => {
    const cancelOrder = async (orderNumberDelete) => {
        try {
            await deleteOrder(orderNumberDelete);
            onOrderCancelled();
            handleClose(); // Close this modal
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order.');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="cancel-popup-container">
                <div className="cancel-header">Attention!</div>
                <div className="cancel-message">
                    <p>Canceling order is available only when the pickup time is more than 24 hours away.</p>
                </div>
                <div className={`cancel-modal-btn ${!canCancelOrder ? 'single-button' : ''}`}>
                    <div onClick={handleClose} className="cancel-cancel">Back</div>
                    {canCancelOrder && (
                        <div
                            onClick={() => {
                                cancelOrder(orderNumber);
                                handleClose(); // Ensure all modals are closed
                            }}
                            className="cancel-confirm"
                        >
                            Confirm
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewCancelOrder;
