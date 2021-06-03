import React from "react";
import "../stylesheets/index_styles.css";

class IndexPage extends React.Component {
    render() {
        return (
            <>
            <header>
                <img src="/images/logo.png" id="logo" alt=""/>
                <h1>Sandchat</h1>
            </header>
            <div id="form-wrapper">
            <div id="form">
                <div id="form-head">
                    <h2>It's time to ditch Discord.</h2>
                    <p>By continuing you agree to our <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a></p>
                </div>
                <div id="nav-wrapper">
                    <a href="/login" className="button-link">
                        <div class="button" style={{marginTop:30}}>
                            Login
                        </div>
                    </a>
                    <a href="/register" className="button-link">
                        <div class="button">
                            Register
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <footer>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="https://www.guilded.gg/i/WknKxlBp">Join us on Guilded</a>
        </footer>
        </>
        );
    }

}

export default IndexPage;