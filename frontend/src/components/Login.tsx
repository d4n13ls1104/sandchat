import React, { useEffect, useState } from "react";
import Error from "./Error";

import axios from "axios";

const initialState = {
    email: "",
    password: "",
    success: false,
    errors: []
};

const Login: React.FC = () => {
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
        setState(initialState);
        axios.post("/user/auth", `email=${state.email}&password=${state.password}`, {withCredentials: true}).then(res => {
            console.log(res.headers["set-cookie"]);
            if(res.data.ok) window.location.href = "/home";
            if(res.data.errors) setState({...state, success: false, errors: res.data.errors});
        }).catch(err => console.error(err));
    }
    return (
        <>
        <div id="form-wrapper">
            <h1>Welcome back</h1>
            <input onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="text" placeholder="Email address" className="input"/>
            <input onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password" className="input"/>
            <button onClick={handleSubmit} type="submit">Login</button>
            <span id="form-text">Don't have an account? <a href="/register">Register</a>!</span>
        </div>
        <div id="alert-wrapper">
             {state.errors.length > 0 ? <Error message={state.errors[0]}/> : null}
        </div>
        </>
    );
}

export default Login;
