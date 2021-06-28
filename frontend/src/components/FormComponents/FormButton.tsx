import styled from "styled-components";

const FormButton = styled.button`
    height:14%;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #4C21E8;
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    transition: background-color 200ms;
    cursor: pointer;
    outline: none;
    
    :hover { background-color: #3D15CB; }
`

export default FormButton;