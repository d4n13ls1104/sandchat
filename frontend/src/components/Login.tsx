import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";

import Error from "components/Common/Error";
import Link from "components/Common/Link";
import Success from "components/Common/Success";

import FormWrapper from "components/FormComponents/FormWrapper";
import FormHeader from "components/FormComponents/FormHeader";
import FormInput from "components/FormComponents/FormInput";
import FormButton from "components/FormComponents/FormButton";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";
import FormSubText from "components/FormComponents/FormSubText";

interface initialStateInterface {
    email: string,
    password: string,
    success: boolean
}

const initialState = {
    email: "",
    password: "",
    success: false
};

const LOGIN_MUTATION = gql`
mutation LoginUser($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
        id
    }
}
`

const Login: React.FC = () => {
    const [state, setState] = useState<initialStateInterface>(initialState);
    const [error, setError] = useState<string | undefined>();

    const [loginUser, { data, loading }] = useMutation(LOGIN_MUTATION, {
        onError: ({ graphQLErrors }) => {
            setState({...state, success: false});
            setError(graphQLErrors[0].message);
        }
    });

    const stateRef = useRef() as React.MutableRefObject<initialStateInterface>;
    stateRef.current = state;

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter") handleSubmit();
    }

    const handleSubmit = async () => {
        await loginUser({
            variables: {
                email: stateRef.current.email,
                password: stateRef.current.password
            }
        }).then((result) => {
            if(result.data) setState({...state, success: true});
        });
    }

    return (
        <>
        <FormAlertWrapper>
            {error !== undefined && !state.success ? <Error message={error}/> : null}
            {data && data.login ? <Success message="Logged in!"/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Login</FormHeader>
            <FormInput onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password"/> 
            <FormButton onClick={handleSubmit} loading={loading}>Login</FormButton>

            <FormSubText>
                Don't have an account? <Link href="/register">Register</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    )
}

export default Login;