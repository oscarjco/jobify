import React from "react";

const FormRow = ({labelName, type, name, value, onChange}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
      {labelName || name}
      </label>
      <input
        type={type}
        name={name}
        className="form-input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormRow;
