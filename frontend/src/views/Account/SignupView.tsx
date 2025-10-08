import React, { useState } from 'react';
import httpService from "../../httpCommon";
import "../../styles/account/Signup.css";
import { useNavigate } from 'react-router-dom';

const axios = httpService();

const FormState = {
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
};

const ErrorState = {
    nameError: '',
    lastNameError: '',
    userNameError: '',
    emailError: '',
    passwordError: '',
};

const SignupView = () => {
    const [formValues, setFormValues] = useState(FormState);
    const [formErrors, setFormErrors] = useState(ErrorState);
    const navigate = useNavigate();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSignUp = async () => {
        setFormErrors(ErrorState);

        const { name, lastName, userName, email, password } = formValues;

        if (!name) setFormErrors(errors => ({ ...errors, nameError: 'Name is required' }));
        if (!lastName) setFormErrors(errors => ({ ...errors, lastNameError: 'Last Name is required' }));
        if (!userName) setFormErrors(errors => ({ ...errors, userNameError: 'User Name is required' }));
        if (!email) setFormErrors(errors => ({ ...errors, emailError: 'Email is required' }));
        if (!password) setFormErrors(errors => ({ ...errors, passwordError: 'Password is required' }));

        if (Object.values(formErrors).some(error => error)) return;

        const userData = {
            FirstName: name,
            LastName: lastName,
            UserName: userName,
            Email: email,
            Password: password,
        };

        axios.post('/api/Account/register', userData)
            .then((response) => {
                console.log(response.data);
                window.alert(`User ${name}!\n has been registered successfully!`);
                setFormValues(FormState);
                navigate('/Login');
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    window.alert('The email is already registered.');
                } else {
                    window.alert('An unexpected error occurred. Please try again later.');
                }
            });
    };

    return (
        <div className='form-container'>
            <div>
                <div>
                    <label>Name:</label>
                    <input
                        className='input input-bordered w-full text-black bg-white'
                        type='text'
                        name='name'
                        value={formValues.name}
                        onChange={handleInputChange}
                    />
                    {formErrors.nameError && <p className='error-message'>{formErrors.nameError}</p>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        className='input input-bordered w-full text-black bg-white'
                        type='text'
                        name='lastName'
                        value={formValues.lastName}
                        onChange={handleInputChange}
                    />
                    {formErrors.lastNameError && <p className='error-message'>{formErrors.lastNameError}</p>}
                </div>
                <div>
                    <label>User Name:</label>
                    <input
                        className='input input-bordered w-full text-black bg-white'
                        type='text'
                        name='userName'
                        value={formValues.userName}
                        onChange={handleInputChange}
                    />
                    {formErrors.userNameError && <p className='error-message'>{formErrors.userNameError}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        className='input input-bordered w-full text-black bg-white'
                        type='email'
                        name='email'
                        value={formValues.email}
                        onChange={handleInputChange}
                    />
                    {formErrors.emailError && <p className='error-message'>{formErrors.emailError}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        className='input input-bordered w-full text-black bg-white'
                        type='password'
                        name='password'
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                    {formErrors.passwordError && <p className='error-message'>{formErrors.passwordError}</p>}
                </div>
                <label>
                    Already have an account? <a href='/Login'>Log in</a>
                </label>
                <br></br>
                <button onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>
    );
}

export default SignupView
