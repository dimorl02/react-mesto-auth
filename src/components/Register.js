function Register({ name, title }) {
    return (
        <section className="login" >
            <div className="login__container">
                <h2 className="login__title" >{title}</h2>
                <form className={`login__form popup__form_type_${name}`} name={name}>
                    <fieldset className="login__set">
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="register-email"
                                id="register-email"
                                type="text" placeholder="Email"
                                minLength="2"
                                maxLength="40"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="login__error-container">
                            <input
                                className="login__text"
                                name="register-password"
                                id="register-password"
                                type="password" placeholder="Password"
                                minLength="2"
                                maxLength="200"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <button className="login__save-button">Зарегистрироваться</button>
                    </fieldset>
                </form>
            </div>
        </section>
    );
}

export default Register;