import React, { useState, useEffect } from 'react';
import httpService from '../../httpCommon';
import "../../styles/account/Login.css";
import { useNavigate } from 'react-router-dom';


const axios = httpService();

const LoginView = () => {
    const [formValues, setFormValues] = useState({
        userName: '',
        password: '',
        showPassword: false,
    });
    const [formErrors, setFormErrors] = useState({
        userNameError: '',
        passwordError: '',
    });
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Validate username and password
        if (formValues.userName === '') {
            setFormErrors(prevErrors => ({ ...prevErrors, userNameError: 'Username is required' }));
        } else {
            setFormErrors(prevErrors => ({ ...prevErrors, userNameError: '' }));
        }
        if (formValues.password === '') {
            setFormErrors(prevErrors => ({ ...prevErrors, passwordError: 'Password is required' }));
        } else {
            setFormErrors(prevErrors => ({ ...prevErrors, passwordError: '' }));
        }
    }, [formValues.userName, formValues.password]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues(prevValues => ({ ...prevValues, [e.target.name]: e.target.value }));
    };
    
    const handleSignIn = async () => {
        if (formErrors.userNameError || formErrors.passwordError) {
            return;
        }

        setLoginError('');

        const userData = {
            UserName: formValues.userName,
            Password: formValues.password,
        };

        try {
            const response = await axios.post('/api/Account/login', userData);
            console.log(response);

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Navigate based on user data from backend
            // You can check response.data for role information if needed
            if (response.data.userName === 'admin') {
                navigate('/dashboard');
            } else {
                navigate("/checkout/address");
            }
        } catch (error: any) {
            console.log(error);
            // Display error message to user
            if (error.response?.data) {
                setLoginError(typeof error.response.data === 'string'
                    ? error.response.data
                    : 'Login failed. Please check your credentials.');
            } else {
                setLoginError('Unable to connect to server. Please try again later.');
            }
        }
    };
       

    return (
        <div className='form-container'>
            <div>
                <div>
                    <label>Username:</label>
                    <input
                        className='register-input '
                        type='text'
                        name='userName'
                        value={formValues.userName}
                        onChange={handleInputChange}
                    />
                    {formErrors.userNameError && <p className='error-message'>{formErrors.userNameError}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        className='register-input'
                        type={formValues.showPassword ? 'text' : 'password'}
                        name='password'
                        value={formValues.password}
                        onChange={handleInputChange}
                    />
                    {formErrors.passwordError && <p className='error-message'>{formErrors.passwordError}</p>}
                </div>
                {loginError && <p className='error-message' style={{color: 'red', fontWeight: 'bold'}}>{loginError}</p>}
                <div className='password-inputr'>
                    <label className='show-password-label'>Show Password</label>
                    <input
                        type='checkbox'
                        id='showPasswordCheckbox'
                        checked={formValues.showPassword}
                        onChange={() => setFormValues(prevValues => ({
                            ...prevValues,
                            showPassword: !prevValues.showPassword
                        }))}
                        className='show-password-checkbox w-5 h-5'
                    />
                </div>

                <label className='forgot-password '>
                    <p>
                        <a href='/forgot-password'>Forgot Password?</a>
                    </p>
                </label>
                <br/>
                <button onClick={handleSignIn}>Sign In</button>
            </div>
            <label className='createAccount '>
                <p>
                    <a href='/Signup'>You can create an account here.</a>
                </p>
            </label>
        </div>
    );
};

export default LoginView;