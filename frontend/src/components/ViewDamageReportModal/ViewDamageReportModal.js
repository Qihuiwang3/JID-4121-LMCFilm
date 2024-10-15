

    import React, { useState, useEffect } from 'react';
    import { Autocomplete, TextField } from '@mui/material';
    import './AdminDamagePopup.css';
   
    
    const AdminDamagePopup = ({ show, handleClose, damageReport, img = [] }) => {
        const imageUrl = "https://s3-alpha-sig.figma.com/img/dda2/83b6/dd4a7c16f4534ac6baeba0ee78d8d32e?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCAVNEHN3O4&Signature=lStzB3TGHFxqtgaDKzSa3Lja4Cp9h4il2Vl6AUBvbuP-L5aj-WHiLjbvP3g9VlFRJFJW7C1Zmm5uscK6S2kmOmNB~zW6w8hW9U0vjBOQVvOa6WQ4pW1DRvTg0bUaHPQDRzvyVLU0l23aNPYenDSUB6vycZeRZw7mI-pKC9C-sitFcoS~cI4R91gyK~tMtIEBAQMg17FB~RESMO9L0VBkrxY7VOZYmE7XBmT9obwjPXYd3IuHCOUUJXtJbnwkvZkT2n4cyvnBbgS~eFSlyuPRMXdykwBBjG99sXgBOoLmaTkFMyCGC0UXVhTtxn~cKEEhHL~p7UcoArMnqUUlAsliFw__";
        const [images, setImages] = useState([]);
        const [loading, setLoading] = useState(true);

        const [damageRep, setDamageRep] = useState([]);
          
        const imageStyle = {
            width: '250px', 
            height: 'auto', 
            display: 'inline-block', 
            marginLeft: '70px' 
            
        };
        useEffect(() => {
           
            const fetchImages = async () => {
                try {
                    const response = await fetch(`/api/damage-report/${damageReport}`); 
                    const data = await response.json();
                    setDamageRep(data); 
                } catch (error) {
                }
            };
    
            fetchImages();
        }, [damageReport]);
  
        if (!show) {
            return null;
        }


return (

    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h2>View Damage Report</h2>
                <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="report-details">
                            <p><strong>Reporter:</strong> {damageRep.reporter || 'Admin'}</p>
                            <p><strong>Date Reported:</strong> {damageRep.date || '10/25/25'}</p>
                            <p><strong>Description:</strong> {damageRep.description || 'The lens of the camera is broken. Let\'s fix this maybe.'}</p>
                            <p>
                        {img && img.length > 0 ? (
                            <div className="image-scroll-container">
                                {damageRep.images.map((image, index) => (
                                     <img key={index} src={image} alt={`Damage image ${index + 1}`} style={imageStyle} />
                                    ))}
                            </div>
                        ) : (
                            // Default camera icon when no images are available
                            <img src={imageUrl} alt="Camera Icon" style={imageStyle} />
                        )}
                    </p>
            </div>
            <div className="modal-footer">
                <button className="cancelModal-button" onClick={handleClose}>Cancel</button>
                <button className="saveModal-button" onClick={handleClose}>Done</button>
            </div>
        </div>
    </div>


);

}

export default AdminDamagePopup;
