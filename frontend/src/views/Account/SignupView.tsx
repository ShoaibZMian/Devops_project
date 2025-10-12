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
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSignUp = async () => {
        const { name, lastName, userName, email, password } = formValues;

        // Validate before submitting
        const errors = { ...ErrorState };
        if (!name) errors.nameError = 'Name is required';
        if (!lastName) errors.lastNameError = 'Last Name is required';
        if (!userName) errors.userNameError = 'User Name is required';
        if (!email) errors.emailError = 'Email is required';
        if (!password) errors.passwordError = 'Password is required';

        setFormErrors(errors);

        // Check if there are any errors
        if (Object.values(errors).some(error => error)) return;

        setSignupError('');

        const userData = {
            FirstName: name,
            LastName: lastName,
            UserName: userName,
            Email: email,
            Password: password,
        };

        try {
            const response = await axios.post('/api/Account/register', userData);
            console.log(response.data);
            window.alert(`User ${name}!\n has been registered successfully!`);
            setFormValues(FormState);
            navigate('/Login');
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 400) {
                    // Check if it's ModelState errors
                    if (error.response.data.errors) {
                        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
                        setSignupError(errorMessages as string);
                    } else if (typeof error.response.data === 'string') {
                        setSignupError(error.response.data);
                    } else {
                        setSignupError('Invalid input. Please check your information.');
                    }
                } else if (error.response.status === 500) {
                    setSignupError('Server error. The email or username may already be registered.');
                } else {
                    setSignupError('An unexpected error occurred. Please try again later.');
                }
            } else {
                setSignupError('Unable to connect to server. Please try again later.');
            }
        }
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
                {signupError && <p className='error-message' style={{color: 'red', fontWeight: 'bold'}}>{signupError}</p>}
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
