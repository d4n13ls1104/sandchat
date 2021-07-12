import React, { useEffect, useState, useRef } from "react";
import { animateScroll } from "react-scroll";
import { gql, useMutation, useQuery } from "@apollo/client";

import  { PersonalNav, PersonalNavAvatar, PersonalNavUsername } from "components/Home/PersonalNav";
import Message, { IMessage } from "components/Home/Message";
import TypingNotification from "components/Home/TypingNotification";
import MainContentWrapper from "components/Home/MainContentWrapper";
import MessageWrapper from "components/Home/MessageWrapper";
import BaseWrapper from "components/Home/BaseWrapper";
import NavWrapper from "components/Home/NavWrapper";
import SettingsButton from "components/Home/SettingsButton";
import MessageInput from "components/Home/MessageInput";

interface UserData {
    username: string,
    avatar: string
}

const CREATE_MESSAGE_MUTATION = gql`
    mutation CreateMessage($channelId: Float!, $content: String!) {
        createMessage(data: {channelId: $channelId, content: $content}) {
            id
        }
    } 
`

const ME_QUERY = gql`
    query MeQuery {
        me {
            username,
            avatar
        }
    }
`

const GET_MESSAGES_QUERY = gql`
    query GetMessages($channelId: Float!, $beforeDate: String!) {
        getMessages(data: {channelId: $channelId, beforeDate: $beforeDate}) {
            id,
            content,
            timestamp,

            author {
                id,
                username,
                avatar
            }
        }
    }
`

const Home: React.FC = () => {
    const [messageBuffer, setMessageBuffer] = useState<IMessage[]>([]);
    const [usersTyping] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState<string>();
    const [user, setUser] = useState<UserData>();

    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const inputStateRef = useRef() as React.MutableRefObject<string>;
    const userRef = useRef() as React.MutableRefObject<UserData>;
    
    inputStateRef.current = input;
    userRef.current = user!;

    const [createMessage] = useMutation(CREATE_MESSAGE_MUTATION, {
        onError: ({ graphQLErrors }) => {
            for(let err of graphQLErrors) {
                for(let propName in err.extensions!.exception.validationErrors[0].constraints) {
                    setError(err.extensions!.exception.validationError[0].constraints[propName]);
                }
            }
        }
    });

    const { data } = useQuery(ME_QUERY);

    const { data: messageData } = useQuery(GET_MESSAGES_QUERY, {
        variables: {
            channelId: 1,
            beforeDate: "3000-05-30"
        }
    });

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        animateScroll.scrollToBottom({
            duration:0,
            delay: 0,
            containerId: "message_wrapper"
        });
    }, [messageBuffer]);

    useEffect(() => (error !== undefined ? console.error(error) : undefined), [error])

    useEffect(() => {
        if(!data || !data.me) return;

        setUser({
            username: data.me.username,
            avatar: data.me.avatar
        });
    }, [data])

    useEffect(() => {
        if(!messageData || !messageData.getMessages) return;

        let fetchedMessages: IMessage[] = [];

        for(let i = messageData.getMessages.length - 1; i >= 0; i--) {
            fetchedMessages.push({
                author: messageData.getMessages[i].author.username,
                avatar: messageData.getMessages[i].author.avatar,
                timestamp: messageData.getMessages[i].timestamp,
                content: messageData.getMessages[i].content
            });
        }

        setMessageBuffer(fetchedMessages);
    }, [messageData]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter" && inputStateRef.current.trim().length !== 0) handleSendMessage();
    }

    const handleSendMessage = () => {
        setMessageBuffer(s => [
            ...s,
            {
                author: userRef.current.username,
                avatar: userRef.current.avatar,
                timestamp: "4:20pm",
                content: inputStateRef.current
            }
        ]);

        inputRef.current.focus();

        createMessage({
            variables: {
                channelId: 1,
                content: inputStateRef.current
            }
        });

        setInput("");
    }


    return (
        <>
        <BaseWrapper>
            <NavWrapper>
                <PersonalNav>
                    <PersonalNavAvatar src={user?.avatar} alt=""/>
                    <PersonalNavUsername>{user?.username}</PersonalNavUsername>
                    <SettingsButton src="/images/gear-fill.svg" alt=""/>
                </PersonalNav>
            </NavWrapper>

            <MainContentWrapper>
                <MessageWrapper id="message_wrapper">
                    {
                        messageBuffer.length > 0 ? 
                            messageBuffer.map((v, i) => (<Message key={i} message={v}/>)) 
                        : null
                    }
                </MessageWrapper>
                <MessageInput ref={inputRef} onChange={(e) => setInput(e.target.value)} value={input} placeholder="Send message"/>
                <TypingNotification users={usersTyping}/>
            </MainContentWrapper>
        </BaseWrapper>
        </>
    )

}

export default Home;