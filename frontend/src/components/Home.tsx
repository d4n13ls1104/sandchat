import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { animateScroll } from "react-scroll";
import io, { Socket } from "socket.io-client";

import { CREATE_MESSAGE_MUTATION } from "gql/Mutations";
import { GET_MESSAGES_QUERY, ME_QUERY } from "gql/Queries";
import { sendMessage } from "utils/sendMessage";
import { formatMessageQueryResponse } from "utils/formatMessageQueryResponse";
import { UserData } from "types/UserData";

import  { PersonalNav, PersonalNavAvatar, PersonalNavUsername } from "components/Home/PersonalNav";
import Message, { IMessage } from "components/Home/Message";
import TypingNotification from "components/Home/TypingNotification";
import MainContentWrapper from "components/Home/MainContentWrapper";
import MessageWrapper from "components/Home/MessageWrapper";
import BaseWrapper from "components/Home/BaseWrapper";
import NavWrapper from "components/Home/NavWrapper";
import SettingsButton from "components/Home/SettingsButton";
import MessageInput from "components/Home/MessageInput";

const Home: React.FC = () => {
    const [messageBuffer, setMessageBuffer] = useState<IMessage[]>([]);
    const [usersTyping] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [error, setError] = useState<string>();
    const [user, setUser] = useState<UserData>();

    // abusing refs.. i know
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const inputStateRef = useRef() as React.MutableRefObject<string>;
    const userRef = useRef() as React.MutableRefObject<UserData>;
    const messageWrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const socketRef = useRef() as React.MutableRefObject<Socket>;
    
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

    const { data: meData } = useQuery(ME_QUERY);

    let [fetchMessages, { data: messageData }] = useLazyQuery(GET_MESSAGES_QUERY);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        Notification.requestPermission();

        socketRef.current = io("/", {
            withCredentials: true
        });

        socketRef.current.on("message", (message) => {
            setMessageBuffer(s => [
                ...s,
                {
                    author: message.author,
                    avatar: message.avatar,
                    timestamp: message.timestamp,
                    content: message.content
                }
            ]);
        });

        // Fetch messages on page load
        fetchMessages({
            variables: {
                channelId: "32d86642-37f2-4833-b4d3-382caac01a12",
                beforeDate: "3000-05-30" // infinitely far in the future
            }
        });

        return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const userScrolledToTop = messageWrapperRef.current.scrollTop === 0;
        if(!userScrolledToTop || messageBuffer.length <= 30) {
            animateScroll.scrollToBottom({
                duration: 0,
                delay: 0,
                containerId: "message_wrapper"
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageBuffer]);

    useEffect(() => (error !== undefined ? console.error(error) : undefined), [error])

    useEffect(() => {
        const noUserDataLoaded = (!meData || !meData.me);

        if(noUserDataLoaded) return;

        setUser({
            username: meData.me.username,
            avatar: meData.me.avatar
        });
    }, [meData])

    useEffect(() => {
        const noMessagesLoaded = (!messageData || !messageData.getMessages);

        if(noMessagesLoaded) return;

        if(messageBuffer.length > 0) {
            return setMessageBuffer(s => formatMessageQueryResponse(messageData).concat(s));
        }

        setMessageBuffer(formatMessageQueryResponse(messageData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageData]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter" && inputStateRef.current.trim().length !== 0) handleSendMessage();
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const userScrolledToTop = e.currentTarget.scrollTop === 0;

        if(userScrolledToTop) {
            fetchMessages({
                variables: {
                    channelId: "32d86642-37f2-4833-b4d3-382caac01a12",
                    beforeDate: messageBuffer[0].timestamp
                }
            });
        }
    }

    const handleSendMessage = () => {

        const message: IMessage = {
            author: userRef.current.username,
            avatar: userRef.current.avatar,
            timestamp: "4:20pm",
            content: inputStateRef.current
        };

        sendMessage(socketRef.current, message);

        setMessageBuffer(s => [
            ...s,
            message
       ]);

        inputRef.current.focus();

        createMessage({
            variables: {
                channelId: "32d86642-37f2-4833-b4d3-382caac01a12",
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
                <MessageWrapper ref={messageWrapperRef} id="message_wrapper" onScroll={handleScroll}>
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