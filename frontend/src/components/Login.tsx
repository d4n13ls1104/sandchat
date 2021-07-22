import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { LOGIN_MUTATION } from "gql/Mutations";

import Error from "components/Common/Error";
import Link from "components/Common/Link";

import FormWrapper from "components/FormComponents/FormWrapper";
import FormHeader from "components/FormComponents/FormHeader";
import FormInput from "components/FormComponents/FormInput";
import FormButton from "components/FormComponents/FormButton";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";
import FormSubText from "components/FormComponents/FormSubText";

const initialInput = {
    email: "",
    password: "",
};

const Login: React.FC = () => {
    const [input, setInput] = useState<typeof initialInput>(initialInput);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>();

    const [loginUser, { loading }] = useMutation(LOGIN_MUTATION, {
        onError: ({ graphQLErrors }) => {
            setSuccess(false); 
            setError(graphQLErrors[0].message);
        }
    });

    const inputRef = useRef() as React.MutableRefObject<typeof initialInput>;
    inputRef.current = input;

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(success) window.location.href = "/home";
    }, [success]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter") handleSubmit();
    }

    const handleSubmit = async () => {
        const loginResult = await loginUser({
            variables: {
                email: inputRef.current.email,
                password: inputRef.current.password
            }
        });

        if(loginResult.data) setSuccess(true); 
    }

    return (
        <>
        <FormAlertWrapper>
            {error !== undefined && !success ? <Error message={error}/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Login</FormHeader>
            <FormInput onChange={(e) => setInput({...input, email: e.target.value})} value={input.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setInput({...input, password: e.target.value})} value={input.password} type="password" placeholder="Password"/> 
            <FormButton onClick={handleSubmit} loading={loading}>Login</FormButton>

            <FormSubText>
                Don't have an account? <Link href="/register">Register</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    )
}

export default Login;