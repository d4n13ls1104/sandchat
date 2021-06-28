import React from "react";

interface Props {
    message: string
}

const Success: React.FC<Props> = ({ message }) => {
    return (
        <div className="success">
            <p>{message}</p>
        </div>
    );
}

export default Success;