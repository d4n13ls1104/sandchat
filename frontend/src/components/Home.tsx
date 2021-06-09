import React, { useEffect, useState } from "react";
import axios from "axios";

import Welcome from "./Welcome";

const Home: React.FC = () => {
    const [username, setUsername] = useState("null");
    useEffect(() => {
        axios.get("/user/payload", {withCredentials:true}).then(res => {
            setUsername(res.data.username);
        }).catch(err => console.error(err));
    });
    return <Welcome username={username}/>;
};

export default Home;
