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
    username: string,
    password: string,
    success: boolean,
}

const initialState = {
    email: "",
    username: "",
    password: "",
    success: false,
};

const REGISTER_MUTATION = gql`
mutation RegisterUser($email: String!, $username: String!, $password: String!) {
    register(data: {email: $email, username: $username, password: $password }) {
        id
    }
}
`

const Register: React.FC = () => {
    const [state, setState] = useState<initialStateInterface>(initialState);
    const [error, setError] = useState<string | undefined>();

    const [registerUser, { data, loading }] = useMutation(REGISTER_MUTATION, {
        onError: ({ graphQLErrors }) => {
            setState({...state, success: false});
            if(graphQLErrors) {
                for(let err of graphQLErrors) {
                    for(let propName in err.extensions!.exception.validationErrors[0].constraints) {
                        setError(err.extensions!.exception.validationErrors[0].constraints[propName]);
                    }
                }
            }
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
        await registerUser({
            variables: {
                email: stateRef.current.email,
                username: stateRef.current.username,
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
            {data && data.register ? <Success message="Account created!"/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Register</FormHeader>
            <FormInput onChange={(e) => setState({...state, email: e.target.value})} value={state.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setState({...state, username: e.target.value})} value={state.username} type="text" placeholder="Username"/>
            <FormInput onChange={(e) => setState({...state, password: e.target.value})} value={state.password} type="password" placeholder="Password"/>
            <FormButton onClick={handleSubmit} loading={loading}>Register</FormButton>

            <FormSubText>
                Already have an account? <Link href="/login">Login</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    );
}

export default Register;