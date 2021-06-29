import React from "react";
import styled from "styled-components";

const Success: React.FC<{ message: string }> = ({ message }) => {
    return (
        <SuccessWrapper>
            <p>{message}</p>
        </SuccessWrapper>
    );
}

const SuccessWrapper = styled.div`
    background-color: #A7F3D0;
    color:#0f0;
    width: 100%;
    border-radius: 5px;
    display: flex;
    justify-content: left;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    align-self: flex-end;
`

export default Success;
