import styled from "styled-components";

const Link = styled.a<{ linkColor?: string | undefined, hoverColor?: string | undefined}>`
    color: ${props => (props.linkColor !== undefined ? props.linkColor : `#4C21E8`)};
    text-decoration: none;
    transition: color 150ms;

    :hover {
        color:${props => (props.hoverColor !== undefined ? props.hoverColor : "")};
    }
`

export default Link;
