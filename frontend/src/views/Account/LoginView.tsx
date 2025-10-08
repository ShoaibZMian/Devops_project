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

        const userData = {
            UserName: formValues.userName,
            Password: formValues.password,
        };

        axios.post('/api/Account/login', userData)
        
            .then((response) => {
                console.log(response);
                localStorage.setItem('token', response.data.token);
            })
            .catch((error) => {
                console.log(error);
            }
        );
        if (userData.UserName === 'admin' && userData.Password === 'Admin.store24') {
            navigate('/dashboard');
        } else {
            navigate("/checkout/address");
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