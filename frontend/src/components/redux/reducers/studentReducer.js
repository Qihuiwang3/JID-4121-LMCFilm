const initialState = {
    email: '',
    name: '',
    classCodes: [],
};

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_STUDENT_INFO':
            return {
                ...state,
                email: action.payload.email,
                name: action.payload.name,
                classCodes: action.payload.classCodes || [],
                role: action.payload.role,
            };
        default:
            return state;
    }
};

export default studentReducer;
