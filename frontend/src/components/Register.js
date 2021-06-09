import React, { useState, useEffect } from "react";
import axios from "axios";

import "../stylesheets/register_styles.css";

import Error from "./Error";
import Success from "./Success";

const initialState = {
    email: "",
    username: "",
    password: "",
    success: false,
    errors: []
};

const Register: React.FC = () => {
    const [state, setState] = useState<typeof initialState>(initialState);
    
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter") handleSubmit();
    }

    const handleSubmit = () => {
        axios.post("/user/register", `email=${state.email}&username=${state.username}&password=${state.password}`).then(res => {
            if(res.data.ok) setState({...state, success: true, errors: []});
            if(res.data.errors) setState({...state, errors: res.data.errors, success: false});
        }).catch(err => console.error(err));
    }

    return (
        <>
            <div id="form-wrapper">
                <h1>Register</h1>
                <input onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="email" placeholder="Email address" className="input"/>
                <input onChange={(e) => setState({...state, username: e.target.value})} value={state.username} type="text" placeholder="Username" className="input"/>
                <input onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password" className="input"/>
                <button onClick={handleSubmit}>Register</button>
                <span id="form-text">Already have an account? <a href="/login">Login</a>!</span>
            </div>
            <div id="alert-wrapper">
                {state.errors.length > 0 ? <Error message={state.errors[0]}/> : null}
                {state.success ? <Success message="Account created successfully!"/> : null}
            </div>
        </>
    );
}

export default Register;
