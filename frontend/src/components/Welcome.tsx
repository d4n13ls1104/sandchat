import React from "react";

interface Props {
    username: string
}

const Welcome: React.FC<Props> = ({username}) => {
    return <h1>Welcome, {username}</h1>;
}

export default Welcome;
