import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown';
import Button from '../../Button/Button';
import { setReservationCartItems } from '../../redux/actions/reservationCartActions';
import TermsModal from '../../Modal/Terms/TermsModal';

function CartConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    const dispatch = useDispatch();

    const [equipment, setEquipment] = useState([]);
    const [packages, setPackages] = useState([]);
    const [isTermsChecked, setIsTermsChecked] = useState(false); // Single source of truth
    const [showTermsModal, setShowTermsModal] = useState(false);

    const cartItems = useSelector(state => state.reservationCart.reservationCartItems);

    const handleTermsCheckboxChange = (checked) => {
        setIsTermsChecked(checked); // Update the main checkbox state
    };

    const openTermsModal = () => {
        setShowTermsModal(true);
    };

    const closeTermsModal = () => {
        setShowTermsModal(false);
    };

    const handleContinue = () => {
        if (isTermsChecked) {
            const cartTotal = calculateTotal();
            navigate('/Payment', { state: { cartTotal } });
        }
    };

    const handleBack = () => {
        navigate('/ReservationPage');
        dispatch(setReservationCartItems(cartItems));
    };

    const calculateTotal = () => {
        let total = 0;
        if (studentInfo.role === 'Admin' || studentInfo.role === 'Professor') {
            total = 0;
        } else {
            cartItems.forEach(item => {
                total += item.price;
            });
        }
        return total.toFixed(2);
    };

    const filterCartContent = () => {
        if (cartItems && cartItems.length > 0) {
            setEquipment(cartItems.filter(item => item.itemId));
            setPackages(cartItems.filter(item => item.bundleId));
        }
    };

    useEffect(() => {
        if (cartItems) {
            filterCartContent();
        }
    }, [cartItems]);

    return (
        <>
            <div className="main-content">
                <div className="cart-confirm-container">
                    <h1 style={{ paddingLeft: '50px', color: '#3361AE' }}>Cart</h1>
                    <div className="cart-contents-container">
                        {equipment && equipment.length > 0 && (
                            <EquipmentDropdown
                                id="equipment"
                                title="Selected Equipment"
                                equipment={equipment}
                                showReserve={false}
                                showQuantity={false}
                            />
                        )}
                        {packages && packages.length > 0 && (
                            <PackageDropdown
                                id="packages"
                                title="Selected Packages"
                                pk={packages}
                                showReserve={false}
                                showQuantity={false}
                            />
                        )}
                        <div className="cart-total">Total: ${calculateTotal()}</div>
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
            </div>
            <TermsModal
                show={showTermsModal}
                handleClose={closeTermsModal}
                isModalChecked={isTermsChecked} // Pass the state to the modal
                onCheckboxChange={handleTermsCheckboxChange} // Sync modal checkbox with main checkbox
            />
        </>
    );
}

export default CartConfirmation;