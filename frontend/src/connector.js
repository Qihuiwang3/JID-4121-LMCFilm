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

const deleteStudent = async (id) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/students/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
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

const createGlobalItem = async (data) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/item`, data, {
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

const updateStudent = async (id, role) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${id}/role`, { role }, {
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

const getClassInfoByCode = async (codeInput) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/class-code/${codeInput}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching class info:', error);
        throw error;
    }
};

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

export {
    getStudents,
    createStudent,
    deleteStudent,
    getCart,
    updateStudent,
    createCart,
    getClassInfoByCode,
    createCartWithData,
    createGlobalItem
};
