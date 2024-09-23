import React from 'react';
import './RoleDropdown.css';


const RoleDropdown = (props) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    props.stopEditing();
    props.node.setDataValue(props.colDef.field, newValue);
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className="dropdown"
    >
      <option value="Student">Student</option>
      <option value="Admin">Admin</option>
    </select>
  );
};

export default RoleDropdown;
