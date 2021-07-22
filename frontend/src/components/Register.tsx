import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { REGISTER_MUTATION } from "gql/Mutations";

import Error from "components/Common/Error";
import Link from "components/Common/Link";
import Success from "components/Common/Success";

import FormWrapper from "components/FormComponents/FormWrapper";
import FormHeader from "components/FormComponents/FormHeader";
import FormInput from "components/FormComponents/FormInput";
import FormButton from "components/FormComponents/FormButton";
import FormAlertWrapper from "components/FormComponents/FormAlertWrapper";
import FormSubText from "components/FormComponents/FormSubText";

const initialInput = {
    email: "",
    username: "",
    password: "",
};

const Register: React.FC = () => {
    const [input, setInput] = useState<typeof initialInput>(initialInput);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [registerUser, { data, loading }] = useMutation(REGISTER_MUTATION, {
        onError: ({ graphQLErrors }) => {
            setSuccess(false);
            if(graphQLErrors) {
                for(let err of graphQLErrors) {
                    for(let propName in err.extensions!.exception.validationErrors[0].constraints) {
                        setError(err.extensions!.exception.validationErrors[0].constraints[propName]);
                    }
                }
            }
        }
    });

    const inputRef = useRef() as React.MutableRefObject<typeof initialInput>;
    inputRef.current = input; 
 
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter") handleSubmit();
    }

    const handleSubmit = async () => {
        const registrationResult = await registerUser({
            variables: {
                email: inputRef.current.email,
                username: inputRef.current.username,
                password: inputRef.current.password
            }
        }); 

        if(registrationResult.data) setSuccess(true);
    }

    return (
        <>
        <FormAlertWrapper>
            {error !== undefined && !success ? <Error message={error}/> : null}
            {data && data.register ? <Success message="Account created!"/> : null}
        </FormAlertWrapper>

        <FormWrapper>
            <FormHeader>Register</FormHeader>
            <FormInput onChange={(e) => setInput({...input, email: e.target.value})} value={input.email} type="email" placeholder="Email address"/>
            <FormInput onChange={(e) => setInput({...input, username: e.target.value})} value={input.username} type="text" placeholder="Username"/>
            <FormInput onChange={(e) => setInput({...input, password: e.target.value})} value={input.password} type="password" placeholder="Password"/>
            <FormButton onClick={handleSubmit} loading={loading}>Register</FormButton>

            <FormSubText>
                Already have an account? <Link href="/login">Login</Link>!
            </FormSubText>
        </FormWrapper>
        </>
    );
}

export default Register;