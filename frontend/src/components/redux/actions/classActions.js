
export const setClassCode = (classCode) => ({
  type: 'SET_CLASS_CODE',
  payload: classCode,
});

export const setSelectedDates = (pickupDateTime, returnDateTime) => ({
  type: 'SET_SELECTED_DATES',
  payload: {
      pickupDateTime,
      returnDateTime,
  },
});
