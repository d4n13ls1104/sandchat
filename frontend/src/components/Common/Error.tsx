import React from "react";
import styled from "styled-components";

const Error: React.FC<{ message: string }> = ({ message }) => {
    return (
        <ErrorWrapper>
            <p>{message}</p>
        </ErrorWrapper>
    );
}

const ErrorWrapper = styled.div`
    background-color: #FECACA;
    color: #f00;
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: left;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    align-self: flex-end;
`

export default Error;
