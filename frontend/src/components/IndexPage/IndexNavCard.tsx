import styled from "styled-components";

export const IndexNavCard = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 420px;
    max-height: 350px;
    border-radius: 5px;
    background-color: #181F25;
    box-sizing: border-box;
    padding: 40px 40px 40px 40px;
`

export const IndexNavHead = styled.div`
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    flex-direction: column;
`

export const IndexNavHeaderText = styled.h2`
    font-size: 25px;
    margin: 0px;
`

export const IndexNavSubHeader = styled.p`
    font-size: 15px;
`

export const IndexNavButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 40%;
`

export const IndexNavButton = styled.div`
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #242c37;
    margin-top: 20px;
    padding-top: 15px;
    padding-bottom:15px;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 150ms;
    font-size: 18px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    :hover { background-color: #323d4d; }
`
