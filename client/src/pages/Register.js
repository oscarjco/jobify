import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/AppContext";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: false,
};

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState(initialState);

  const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext();

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, isMember } = values;

    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = {name, email, password};

    if(isMember) {
      setupUser({
        currentUser,
        endpoint: 'login',
        alertText: 'Login Successful! Redirecting...'
      })
    } else {
      setupUser({
        currentUser,
        endpoint: 'register',
        alertText: 'User Created! Redirecting...'
      })
    }
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  useEffect(() => {
    if (user) {
      console.log('Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            labelName="Name"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        )}

        <FormRow
          labelName="Email"
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        <FormRow
          labelName="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          {values.isMember ? "Not a member yet? " : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
