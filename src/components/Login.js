import * as auth from '../utils/auth';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login({ name, title, handleLogin}) {
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
      })
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        const {name, value} = e.target;
    
        setFormValue({
          ...formValue,
          [name]: value
        });
      }
      
      const handleSubmit = (evt) => {
        evt.preventDefault();
        setFormValue({email: '', password: ''});
        handleLogin();
        navigate('/', {replace: true});
      }


    return (
        <section className="login" >
            <div className="login__container">
                <h2 className="login__title" >{title}</h2>
                <form className={`login__form popup__form_type_${name}`} name={name} onSubmit={handleSubmit}>
                    <fieldset className="login__set">
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="login-email"
                                id="login-email"
                                type="text" placeholder="Email"
                                minLength="2"
                                maxLength="40"
                                required
                                autoComplete="off"
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="login-password"
                                id="login-password"
                                type="password" placeholder="Password"
                                minLength="2"
                                maxLength="200"
                                required
                                autoComplete="off"
                                onChange={handleChange} 
                            />
                        </div>
                        <button className="login__save-button">Войти</button>
                    </fieldset>
                </form>
            </div>
        </section>
    );
}

export default Login;