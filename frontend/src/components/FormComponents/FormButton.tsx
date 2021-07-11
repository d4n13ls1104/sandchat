import styled from "styled-components";

const FormButton = styled.button<{ loading?: boolean }>`
    height:14%;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: ${props => (props.loading ? "#D1D5DB" : "#4C21E8")};
    font-size: 18px;
    color: ${props => (props.loading ? "#9CA3AF" : "#fff")};
    font-weight: bold;
    transition: background-color 200ms;
    cursor: pointer;
    outline: none;
    
    :hover { background-color: ${props => (props.loading ? "": "#3D15CB")} }
`

export default FormButton;