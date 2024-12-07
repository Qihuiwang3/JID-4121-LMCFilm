import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import Button from '../../Button/Button';
import TermsModal from '../../Modal/Terms/TermsModal';


function CartConfirmation() {
    const [isTermsChecked, setIsTermsChecked] = useState(false); 
    const [showTermsModal, setShowTermsModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { unpackedCartItems, originalCartItems } = location.state || {};
    const [equipment, setEquipment] = useState([]);
    const totalValue = useSelector(state => state.reservationCart.totalValue);

    const handleTermsCheckboxChange = (checked) => {
        setIsTermsChecked(checked);
    };

    const openTermsModal = () => {
        setShowTermsModal(true);
    };

    const closeTermsModal = () => {
        setShowTermsModal(false);
    };

    const handleContinue = () => {
        if (isTermsChecked) {
            const cartTotal = totalValue;
            navigate('/Payment', { state: { cartTotal, unpackedCartItems } });
        }
    };

    const handleBack = () => {
        navigate('/ReservationPage', { state: { cartItems: originalCartItems } });
    };

    useEffect(() => {
        if (unpackedCartItems) {
            console.log("unpackedCartItems: ", unpackedCartItems)
            const equipmentItems = unpackedCartItems
                .filter(item => !item.bundleName)
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
            console.log("equipmentItems: ", equipmentItems)

            setEquipment(equipmentItems);
        }
    }, [unpackedCartItems]);

    return (
        <div className="main-content">
            <h1 className="cart-header-text">Cart Confirmation</h1>
            <div className="cart-contents-container">
                {equipment.length > 0 && (
                    <EquipmentDropdown
                        id="equipment"
                        title="Equipment"
                        equipment={equipment}
                        showReserve={false}
                    />
                )}
                {totalValue && (
                    <div className="cart-total">Total: ${totalValue}</div>
                )}

                <div className="terms-container">
                    <input
                        id="termsCheckbox"
                        type="checkbox"
                        checked={isTermsChecked}
                        onChange={(e) => handleTermsCheckboxChange(e.target.checked)}
                    />
                    <span>
                        I have read and agree to the&nbsp;
                        <span className="terms-link" onClick={openTermsModal}>
                            Rental Terms and Conditions
                        </span>
                    </span>
                </div>
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={handleBack}>
                    Back
                </Button>
                <Button
                        type="next"
                        onClick={handleContinue}
                        disabled={!isTermsChecked} // Disable button when unchecked
                    >
                        Continue
                </Button>
            </div>
            <TermsModal
                show={showTermsModal}
                handleClose={closeTermsModal}
                isModalChecked={isTermsChecked} // Pass the state to the modal
                onCheckboxChange={handleTermsCheckboxChange} // Sync modal checkbox with main checkbox
            />
        </div>
    );
}

export default CartConfirmation;
