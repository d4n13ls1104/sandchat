import React from "react";

interface Props {
    message: string
}

const Error: React.FC<Props> = ({ message }) => {
    return (
        <div className="error">
            <p>{message}</p>
        </div>
    );
}

export default Error;