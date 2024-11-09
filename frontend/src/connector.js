import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const getStudents = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/students`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const loginStudent = async (email, password) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/students/login`, { email, password }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

const createStudent = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/students`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateStudentRole = async (email, role) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${email}/role`, { role }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error updating student role:', error);
        throw error;
    }
};

const deleteStudent = async (email) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/students/${email}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const updateStudentInfo = async (email, name) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${email}`, { name }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const addClassCode = async (email, classCode) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${email}/add-classcode`, { classCode }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const getCart = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/carts`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createCart = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/carts`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getItems = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/items`);
        return res.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getItemByName = async (itemName) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/item/${itemName}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createGlobalItem = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/item`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const deleteGlobalItem = async (itemName, itemId) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/deleteItemId/${itemId}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { itemName },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getClassCodes = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/class-codes/`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getClassInfoByCode = async (codeInput) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/class-code/${codeInput}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching class info:', error);
        throw error;
    }
};

const getSingleItemsByClassCode = async (codeInput) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/single-items/${codeInput}`);
        console.log(res.data)
        return res.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const createCartWithData = async (cartData) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/carts`, cartData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error creating cart:', error);
        throw error;
    }
};

const removeClassCode = async (email, classCode) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${email}/remove-classcode`, { classCode }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

const createClassCode = async (newClassCode) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/class-code/`, {
            code: newClassCode.code,
            professor: newClassCode.professor,
            className: newClassCode.className
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteClassCode = async (classCode) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/class-code/${classCode}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateClassCode = async (updatedClass) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/api/class-code/${updatedClass.code}`, {
            className: updatedClass.className,
            professor: updatedClass.professor
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const getBundleItemsByClassCode = async (classCode) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/bundle-items/${classCode}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createBundleItem = async (itemData) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/bundle-item`, itemData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error adding single item:', error);
        throw error;
    }
};

const toggleRepairStatus = async (itemName, itemId) => {
    try {
        const res = await axios.patch(`${BACKEND_URL}/api/item/itemId/${itemId}/repair`, { itemName }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const toggleHideStatus = async (itemName, itemId) => {
    try {
        const res = await axios.patch(`${BACKEND_URL}/api/item/itemId/${itemId}/hide`, { itemName }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createSingleItem = async (itemData) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/single-item`, itemData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error adding single item:', error);
        throw error;
    }
};

const updateBundleItem = async (updatedBundleItem) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/api/bundle-items/${updatedBundleItem.bundleId}`, updatedBundleItem, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error adding single item:', error);
        throw error;
    }
};

const getAllOrders = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/orders`);
        return res.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);

    }
};


const createOrder = async (orderData) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/order`, orderData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};


const createDamageReport = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/damage-reports`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (error) {
        console.error('Error creating damage report:', error);
        throw error;
    }
};

const getAllDamageReports = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/damage-reports`);
        return res.data;
    } catch (error) {
        console.error('Error fetching damage reports:', error);
        throw error;
    }
};

const getSingleDamageReport = async (id) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/damage-reports/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching damage report:', error);
        throw error;
    }
};

const deleteDamageReport = async (id) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/damage-reports/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error deleting damage report:', error);
        throw error;
    }
};

const updateDamageReport = async (id, data) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/api/damage-reports/${id}`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return res.data;
    } catch (error) {
        console.error('Error updating damage report:', error);
        throw error;
    }
};

const getRepairStatus = async (itemName, itemId) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/item/repair-status`, {
            itemName,
            itemId,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error getting repair status:', error);
        throw error;
    }
};

const getOrderByEmail = async (email) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/order/email/${email}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching order by email:', error);
        throw error;
    }
};

const getOrderByOrderNumber = async (orderNumber) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/order/${orderNumber}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching order by order number:', error);
        throw error;
    }
};

const updateOrderByOrderNumber = async (orderNumber, updateData) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/api/order/${orderNumber}`, {
            equipment: updateData.equipment,
            checkedoutStatus: updateData.checkedoutStatus,
            checkedout: updateData.checkedout,
            checkedinStatus: updateData.checkedinStatus,
            checkedin: updateData.checkedout,
            checkout: updateData.checkout,
            beenExtended: updateData.beenExtended
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error updating order by order number:', error);
        throw error;
    }
};
const getOrderById = async (id) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/order/id/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw error;
    }
};

const removeSingularItem = async (itemName, itemId) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/deleteItemId/${itemId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { itemName },
        });
        return res.data;
    } catch (error) {
        console.error('Error deleting single item:', error);
        throw error;
    }
};


const deleteBundleItem = async (bundleId, itemName) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/bundle-items/${bundleId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { itemName },
        });
        return res.data;
    } catch (error) {
        console.error('Error deleting bundle item:', error);
        throw error;
    }
};

const deleteOrder = async (orderNumber) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/api/order/${orderNumber}/`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const isItemIdExist = async (itemName, itemId) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/item/itemName/itemId/${itemName}/${itemId}/existence`);
        return res.data;
    } catch (error) {
        console.error('Error checking if itemId exists:', error);
        throw error;
    }
};

const sendEmail = async (emailData) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData)
        });


        if (!response.ok) {
            throw new Error('Failed to send email');
        }


        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export {
    getStudents,
    createStudent,
    deleteStudent,
    getCart,
    createCart,
    getItems,
    getItemByName,
    createGlobalItem,
    deleteGlobalItem,
    toggleRepairStatus,
    toggleHideStatus,
    getClassCodes,
    createClassCode,
    deleteClassCode,
    updateClassCode,
    getBundleItemsByClassCode,
    createBundleItem,
    getClassInfoByCode,
    createCartWithData,
    updateStudentInfo,
    addClassCode,
    loginStudent,
    removeClassCode,
    updateStudentRole,
    createSingleItem,
    updateBundleItem,
    getSingleItemsByClassCode,
    getAllOrders,
    createOrder,
    getOrderByEmail,
    getOrderByOrderNumber,
    createDamageReport,
    getAllDamageReports,
    getSingleDamageReport,
    deleteDamageReport,
    updateDamageReport,
    getRepairStatus,
    updateOrderByOrderNumber,
    getOrderById,
    removeSingularItem,
    deleteBundleItem,
    sendEmail,
    deleteOrder,
    isItemIdExist
};
