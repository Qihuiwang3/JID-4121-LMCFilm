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

const deleteStudent = async (email) => {
    try {
        const res = await axios.delete(`${BACKEND_URL}/students/${email}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateStudent = async (email, role) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/students/${email}/role`, { role }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (error) {
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

// Add class code to student
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

export {
    getStudents,
    createStudent,
    deleteStudent,
    getCart,
    updateStudent,
    createCart,
    getClassInfoByCode,
    createCartWithData,
    createGlobalItem,
    updateStudentInfo,
    addClassCode,
    loginStudent,
    removeClassCode
};
