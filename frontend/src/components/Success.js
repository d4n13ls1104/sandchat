import React from "react";

class Success extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="success">
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default Success;