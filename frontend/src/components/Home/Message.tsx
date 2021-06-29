import styled from "styled-components";

export type IMessage = {
    author: string,
    avatar: string,
    timestamp: string,
    content: string
}

const Message: React.FC<{ message: IMessage }> = ({ message }) => {
    return (
        <Wrapper>
            <MessageAvatar src={message.avatar} alt=""/>
            <MessageHeader>
                <MessageUsername>{message.author}</MessageUsername>
                <MessageBadge src="/images/patch-check-fill.svg" alt=""/>
                <MessageTimestamp>{message.timestamp}</MessageTimestamp>
                <MessageContent>{message.content}</MessageContent>
            </MessageHeader>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    width: 90%;
    box-sizing: border-box;
    padding: 10px;
    padding-top: 15px;
    padding-bottom: 15px;;
`

const MessageAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 10px;
`

const MessageUsername = styled.span`
    font-weight: bold;
`

const MessageBadge = styled.img`
    align-self: center;
    margin-left: 5px;
    width: 16px;
    height: 16px;
`

const MessageTimestamp = styled.span`
    color: #b2bdcd;
    font-size: 12px;
    margin-left: 5px;
`

const MessageContent = styled.div`
    margin-top: 2px;
    width: 80%;
    word-wrap: break-word;
    word-break: break-all;
`

export default Message;
