import React from "react";

import Link from "components/Common/Link";

import Header from "components/IndexPage/Header";
import HeaderLogo from "components/IndexPage/HeaderLogo";
import Footer from "components/IndexPage/Footer";

import { IndexNavCard, IndexNavHead, IndexNavHeaderText, IndexNavSubHeader, IndexNavButtonWrapper, IndexNavButton } from "components/IndexPage/IndexNavCard";

const Index: React.FC = () => {
    return (
        <>
        <Header>
            <HeaderLogo src="/images/logo.png" alt=""/>
            <h1>Sandchat</h1>
        </Header>

        <IndexNavCard>
            <IndexNavHead>
                <IndexNavHeaderText>
                    It's time to ditch Discord.
                </IndexNavHeaderText>

                <IndexNavSubHeader>
                    By continuing you agree to our <Link href="#">Privacy Policy</Link> and <Link href="#">Terms of Service</Link>
                </IndexNavSubHeader>
            </IndexNavHead>
            
            <IndexNavButtonWrapper>
                <Link linkColor="#fff" href="/login">
                    <IndexNavButton>Login</IndexNavButton>
                </Link>
                <Link linkColor="#fff" href="/register">
                    <IndexNavButton>Register</IndexNavButton>
                </Link>
            </IndexNavButtonWrapper>
        </IndexNavCard>

        <Footer>
            <Link linkColor="#b2bdcd" hoverColor="#dee3ea" href="#">Privacy Policy</Link>
            <Link linkColor="#b2bdcd" hoverColor="#dee3ea" href="#">Terms of Service</Link>
            <Link linkColor="#b2bdcd" hoverColor="#dee3ea" href="https://www.guilded.gg/i/WknKxlBp">Join us on Guilded</Link>
        </Footer>
        </>
    );
}

export default Index;
