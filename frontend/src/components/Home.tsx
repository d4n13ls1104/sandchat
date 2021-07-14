import React, { useEffect, useState, useRef } from "react";
import { animateScroll } from "react-scroll";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { CREATE_MESSAGE_MUTATION } from "gql/Mutations";
import { GET_MESSAGES_QUERY, ME_QUERY } from "gql/Queries";

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

    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const inputStateRef = useRef() as React.MutableRefObject<string>;
    const userRef = useRef() as React.MutableRefObject<UserData>;
    const messageWrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    
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

    const [fetchMessages, { data: messageData }] = useLazyQuery(GET_MESSAGES_QUERY);

    // converts graphql response to IMessage array
    const formatMessageQueryResponse = (): IMessage[] => {
        let fetchedMessages: IMessage[] = [];

        for(let i = messageData.getMessages.length - 1; i >= 0; i--) {
            fetchedMessages.push({
                author: messageData.getMessages[i].author.username,
                avatar: messageData.getMessages[i].author.avatar,
                timestamp: messageData.getMessages[i].timestamp,
                content: messageData.getMessages[i].content
            });
        }

        return fetchedMessages;
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

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
        if(messageWrapperRef.current.scrollTop !== 0 || messageBuffer.length <= 30) {
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
        if(!meData || !meData.me) return;

        setUser({
            username: meData.me.username,
            avatar: meData.me.avatar
        });
    }, [meData])

    useEffect(() => {
        if(!messageData || !messageData.getMessages) return;

        if(messageBuffer.length > 0) {
            return setMessageBuffer(s => formatMessageQueryResponse().concat(s));
        }

        setMessageBuffer(formatMessageQueryResponse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageData]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter" && inputStateRef.current.trim().length !== 0) handleSendMessage();
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if(e.currentTarget.scrollTop === 0) {
            fetchMessages({
                variables: {
                    channelId: "32d86642-37f2-4833-b4d3-382caac01a12",
                    beforeDate: messageBuffer[0].timestamp
                }
            });
        }
    }

    const handleSendMessage = () => {
        setMessageBuffer(s => [
            ...s,
            {
                author: userRef.current.username,
                avatar: userRef.current.avatar,
                timestamp: "4:20pm", // will change this static timestamp before release
                content: inputStateRef.current
            }
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