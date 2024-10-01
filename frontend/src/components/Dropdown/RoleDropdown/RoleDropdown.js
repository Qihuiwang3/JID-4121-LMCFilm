import React from 'react';
import './RoleDropdown.css';

const RoleDropdown = (props) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    props.node.setDataValue(props.colDef.field, newValue);
    props.onChange(event); 
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
