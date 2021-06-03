import React from "react";

class Error extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="error">
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default Error;