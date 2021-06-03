import React from "react";
import "../stylesheets/register_styles.css";
import axios from "axios";

import Error from "./Error";
import Success from "./Success";

const initialState = {
    email: "",
    username: "",
    password: "",
    success: false,
    errors: []
}

class Register extends React.Component {
    constructor() {
        super();
        this.state = initialState;

        this.updateEmail = this.updateEmail.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    updateEmail(e) {
        this.setState({ email: e.target.value });
    }

    updateUsername(e) {
        this.setState({ username: e.target.value });
    }

    updatePassword(e) {
        this.setState({ password: e.target.value });
    }

    handleSubmit() {
        axios.post("/user/register", `email=${this.state.email}&username=${this.state.username}&password=${this.state.password}`)
        .then(res => {
            if(res.data.ok) {
                this.setState({ errors: [] });
                this.setState({ success: true });
            }
            if(res.data.errors) {
                this.setState({ errors: res.data.errors });
                this.setState({ success: false });
            }
        });
        this.setState(initialState);
    }

    handleKeyDown(e) {
        if(e.keyCode == 13) this.handleSubmit();
    }

    render() {
        var errors;
        var success;
        if(this.state.success) success = <Success message="Account successfully created!"/>
        if(this.state.errors.length > 0) errors = <Error message={this.state.errors[0]}/>
        return (
            <>
                <div id="form-wrapper" tabvIndex="0" onKeyDown={this.handleKeyDown}>
                    <h1>Register</h1>
                    <input onChange={this.updateEmail} value={this.state.email} type="text" placeholder="Email address" className="input"/>
                    <input onChange={this.updateUsername} value={this.state.username} type="text" placeholder="Username" className="input"/>
                    <input onChange={this.updatePassword} value={this.state.password} type="password" placeholder="Password" className="input"/>
                    <button onClick={this.handleSubmit} type="submit">Register</button>
                    <span id="form-text">Already have an account? <a href="/login">Login</a>!</span>
                </div>
                <div id="error-wrapper">
                    {errors}
                    {success}
                </div>
            </>
        );
    }
}

export default Register;