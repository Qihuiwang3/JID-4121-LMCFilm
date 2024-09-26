const initialState = {
    classCode: '',
    selectedDates: {
        pickupDateTime: null,
        returnDateTime: null,
    },
  };
  
  const classReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CLASS_CODE':
            return {
                ...state,
                classCode: action.payload,
            };
        case 'SET_SELECTED_DATES':
            return {
                ...state,
                selectedDates: {
                    pickupDateTime: action.payload.pickupDateTime,
                    returnDateTime: action.payload.returnDateTime,
                },
            };
        default:
            return state;
    }
  };
  
  export default classReducer;
  