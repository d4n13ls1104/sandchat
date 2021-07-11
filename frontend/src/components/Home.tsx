import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { animateScroll } from "react-scroll";

import  { PersonalNav, PersonalNavAvatar, PersonalNavUsername } from "components/Home/PersonalNav";
import Message, { IMessage } from "components/Home/Message";
import TypingNotification from "components/Home/TypingNotification";
import MainContentWrapper from "components/Home/MainContentWrapper";
import MessageWrapper from "components/Home/MessageWrapper";
import BaseWrapper from "components/Home/BaseWrapper";
import NavWrapper from "components/Home/NavWrapper";
import SettingsButton from "components/Home/SettingsButton";
import MessageInput from "components/Home/MessageInput";

interface initialStateInterface {
    username: string,
    messageInput: string,
    loadedMessages: IMessage[],
    usersTyping: string[]
}

const initialState = {
    username: "",
    messageInput: "",
    loadedMessages: [],
    usersTyping: []
};

const Home: React.FC = () => {
    const [state, setState] = useState<initialStateInterface>(initialState);
    const messageInput = useRef() as React.MutableRefObject<HTMLInputElement>;

    const stateRef = useRef() as React.MutableRefObject<initialStateInterface>;
    stateRef.current = state;

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        axios.get("/api/user/payload", { withCredentials: true }).then(({data}) => {
            setState((s) => ({...s, username: data.username}));
        }).catch(err => console.error(err));

        axios.get("/api/channels/1/messages/?beforeDate=3000-05-30", { withCredentials: true }).then(({data}) => {
            setState(s => ({...s, loadedMessages: data}));
        }).catch(err => console.error(err));

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    useEffect(() => {
        animateScroll.scrollToBottom({
            duration: 0,
            delay: 0,
            containerId: "message_wrapper"
        });
    }, [state.loadedMessages])

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === "Enter" && stateRef.current.messageInput.trim() !== "") {
            handleSendMessage();
            
            messageInput.current!.focus();

            setState((s) => ({...s, input: ""}));
        }
    }

    const handleSendMessage = () => {
        setState((s) => ({
            ...s,
            messages: [
                ...s.loadedMessages,
                {
                    author: s.username,
                    avatar: "https://cdn.discordapp.com/avatars/610282858418012161/e8e1f22001b4bbc086cc93fbe8a3ec83.webp?size=256",
                    timestamp: "8:17pm",
                    content: s.messageInput
                }
            ]
        }));

        axios.post("/api/channels/1/messages", `content=${stateRef.current.messageInput}`).then();
    }

    return (
        <BaseWrapper>
            <NavWrapper>
                <PersonalNav>
                    <PersonalNavAvatar src="https://cdn.discordapp.com/avatars/610282858418012161/e8e1f22001b4bbc086cc93fbe8a3ec83.webp?size=256" alt=""/>
                    <PersonalNavUsername>{state.username}</PersonalNavUsername>
                    <SettingsButton src="/images/gear-fill.svg" alt=""/>
                </PersonalNav>
            </NavWrapper>

            <MainContentWrapper>
                <MessageWrapper id="message_wrapper">
                    {
                        state.loadedMessages.length > 0 ?
                            state.loadedMessages.map((v: IMessage, i) => {
                                return <Message key={i} message={v}/>
                            })
                        : null
                    }
                </MessageWrapper>

                <MessageInput ref={messageInput} onChange={(e) => setState({...state, messageInput: e.target.value})} value={state.messageInput} placeholder="Send message"/>
                <TypingNotification users={state.usersTyping}/>
            </MainContentWrapper>
            
        </BaseWrapper>
    );
}

export default Home;
