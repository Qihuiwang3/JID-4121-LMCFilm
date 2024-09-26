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

const getClassCodes = async () => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/class-codes/`);
        return res.data;
    } catch (error) {
        console.log(error);
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
        const res = await axios.put(`${BACKEND_URL}/api/class-code`, {
            code: updatedClass.code,
            className: updatedClass.className,
        });
        return res.data; 
    } catch (error) {
        console.log(error);
        throw error; 
    }
};



export {
    getStudents,
    createStudent,
    deleteStudent,
    updateStudent,
    getCart,
    createCart,
    createGlobalItem,
    getClassCodes,
    createClassCode,
    deleteClassCode,
    updateClassCode

};
