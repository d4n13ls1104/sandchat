import React, { useState, useEffect } from "react";
import axios from "axios";

import Error from "components/Common/Error";
import Link from "components/Common/Link";
import Success from "components/Common/Success";

import FormWrapper from "components/FormComponents/FormWrapper";
import FormHeader from "components/FormComponents/FormHeader";
import FormInput from "components/FormComponents/FormInput";
import FormButton from "components/FormComponents/FormButton";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";
import FormSubText from "components/FormComponents/FormSubText";

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
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter") handleSubmit();
    }

    const handleSubmit = () => {
        axios.post("/api/user/register", `email=${state.email}&username=${state.username}&password=${state.password}`).then(({data}) => {
            if(data.ok) setState({...initialState, success: true});

            if(data.errors) setState({...state, errors: data.errors, success: false});
        }).catch(err => console.error(err));
    }

    return (
        <>
        <FormAlertWrapper>
            {state.errors.length > 0 ? <Error message={state.errors[0]}/> : null}
            {state.success ? <Success message="Account created successfully!"/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Register</FormHeader>
            <FormInput onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setState({...state, username: e.target.value})} value={state.username} type="text" placeholder="Username"/>
            <FormInput onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password"/>
            <FormButton onClick={handleSubmit}>Register</FormButton>

            <FormSubText>
                Already have an account? <Link href="/login">Login</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    );
}

export default Register;
