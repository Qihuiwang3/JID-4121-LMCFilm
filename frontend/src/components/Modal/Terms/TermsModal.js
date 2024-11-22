import React, { useState, useEffect } from 'react';
import './TermsModal.css';

const TermsModal = ({ show, handleClose, isModalChecked, onCheckboxChange }) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

    // Reset scroll state when modal opens
    useEffect(() => {
        if (show) {
            setHasScrolledToBottom(false); // Reset scrolling state
        }
    }, [show]);

    const handleScroll = (e) => {
        const element = e.target;
        const isScrolledToBottom =
            Math.ceil(element.scrollTop + element.clientHeight) >= element.scrollHeight;

        if (isScrolledToBottom && !hasScrolledToBottom) {
            setHasScrolledToBottom(true); // Allow checkbox interaction
        }
    };

    const handleCheckboxChange = (checked) => {
        onCheckboxChange(checked); // Sync with parent state
        if (checked) {
            handleClose(); // Close the modal when the checkbox is checked
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-outer-content">
                <div className="modal-header">
                    <h2>Rental Terms and Conditions</h2>
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <div className="modal-content" onScroll={handleScroll}>
                    <h2>LMCFilms Rental Terms and Conditions</h2>
                    <p>
                        By reserving and using the film and video equipment provided by LMCFilms, you ("Patron")
                        agree to the following terms and conditions:
                    </p>
                    <ol>
                        <li>
                            <strong>Equipment Reservation and Responsibility:</strong>
                            <ul>
                                <li>
                                    Patrons must reserve Equipment 48 hours in advance through the designated
                                    checkout system.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Reporting Lost or Stolen Equipment:</strong>
                            <ul>
                                <li>
                                    In the event of lost or stolen Equipment, the Patron must immediately report the
                                    incident to the local law enforcement authorities.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Damaged Equipment:</strong>
                            <ul>
                                <li>
                                    The Patron must inspect all Equipment upon checkout and report any pre-existing
                                    damages to the equipment staff.
                                </li>
                                <li>
                                    Report any damages or malfunctions discovered during checkout immediately to the
                                    equipment staff.
                                </li>
                                <li>
                                    The Patron is responsible for any repairs or replacement costs incurred due to
                                    damages caused during their use of the Equipment, up to a maximum of $300.00 per
                                    damaged item.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Missing Items:</strong>
                            <ul>
                                <li>
                                    The Patron must verify the presence of all accessories and accompanying items
                                    listed in the equipment inventory at the time of checkout.
                                </li>
                                <li>
                                    If any items are missing upon return, the Patron must report it to the equipment
                                    staff.
                                </li>
                                <li>
                                    The Patron is responsible for replacing any missing items up to $100.00.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Late Returns and Overdue Fees:</strong>
                            <ul>
                                <li>
                                    You must return your Equipment on or before the specified due date and time.
                                </li>
                                <li>
                                    Unless an extension is approved, late returns will incur a fee of $25.00 daily.
                                </li>
                                <li>
                                    Failure to return Equipment may result in additional penalties, including
                                    suspension of equipment checkout privileges.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Proper Use and Care:</strong>
                            <ul>
                                <li>
                                    The Patron agrees to use the Equipment solely for lawful purposes related to
                                    academic or university-affiliated activities.
                                </li>
                                <li>
                                    The Patron must follow the manufacturer's instructions and guidelines for the
                                    safe and proper use of the Equipment.
                                </li>
                                <li>
                                    The Patron is responsible for ensuring the Equipment is used and stored securely
                                    and appropriately.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Indemnification:</strong>
                            <ul>
                                <li>
                                    The Patron agrees to indemnify and hold LMCFilms, its officers, employees, and
                                    affiliates harmless from any claims, damages, or liabilities arising from the
                                    Patron's use or misuse of the Equipment.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Reservation Cancellation:</strong>
                            <ul>
                                <li>
                                    Patrons must cancel reservations at least 4 hours in advance if they no longer
                                    require the Equipment.
                                </li>
                                <li>
                                    Please cancel reservations within the specified timeframe to avoid penalties or
                                    restrictions on future equipment reservations.
                                </li>
                                <li>The Patron will receive a warning for a no-show on the first instance.</li>
                                <li>
                                    For a second instance of a no-show, the Patron will be subject to a $10
                                    restocking fee or loss of rental privileges for one month.
                                </li>
                            </ul>
                        </li>
                    </ol>
                </div>
                <div className="term-modal-footer">
                    <label
                        className={
                            !hasScrolledToBottom && !isModalChecked
                                ? 'disabled-label'
                                : 'enabled-label'
                        }
                    >
                        <input
                            type="checkbox"
                            disabled={!hasScrolledToBottom && !isModalChecked} // Disable only if not scrolled and not checked
                            checked={isModalChecked} // Sync with parent state
                            onChange={(e) => handleCheckboxChange(e.target.checked)} // Close modal on checkbox click
                        />
                        I acknowledge and agree to the terms and conditions
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;