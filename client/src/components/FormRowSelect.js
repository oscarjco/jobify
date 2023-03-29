import React from "react";

const FormRowSelect = ({ label, name, value, onChange, list }) => {
  return (
    <div className="form-row">
      <label for={name} className="form-label">
        {label || name}
      </label>
      <select
        className="form-select"
        name={name}
        value={value}
        onChange={onChange}
      >
        {list.map((item, index) => {
          return <option key={index} value={item}>{item}</option>;
        })}
      </select>
    </div>
  );
};

export default FormRowSelect;
