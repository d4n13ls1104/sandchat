import React from "react";

const Error = (props) => {
    return (
        <div className="error">
            <p>{props.message}</p>
        </div>
    );
}

export default Error;
