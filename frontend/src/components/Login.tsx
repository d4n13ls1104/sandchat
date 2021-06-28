import React, { useEffect, useState } from "react";

import Error from "components/Common/Error";
import Link from "components/Common/Link";

import FormWrapper from "components/FormComponents/FormWrapper";
import FormHeader from "components/FormComponents/FormHeader";
import FormInput from "components/FormComponents/FormInput";
import FormButton from "components/FormComponents/FormButton";
import FormSubText from "components/FormComponents/FormSubText";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";

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
        axios.post("/api/user/auth", `email=${state.email}&password=${state.password}`).then(({data}) => {
            if(data.ok) window.location.href = "/home";
            if(data.errors) setState({...state, success: false, errors: data.errors});
        }).catch(err => console.error(err));
    }

    return (
        <>
        <FormAlertWrapper>
            {state.errors.length > 0 ? <Error message={state.errors[0]}/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Login</FormHeader>
            <FormInput onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password"/>
            <FormButton onClick={handleSubmit}>Login</FormButton>

            <FormSubText>
                Don't have an account? <Link href="/register">Register</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    );
}

export default Login;
