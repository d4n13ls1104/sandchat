import React from "react";

// WILL REFACTOR SOON

const TypingNotification: React.FC<{ users: string[] }> = ({users}) => {
    return (
        <div id="loading_wrapper">
            {
                users.length > 0 ? 
                <div className="loading">
                    <div className="dot one"></div>
                    <div className="dot two"></div>
                    <div className="dot three"></div>
                </div> : null
            }
            <span>
                {
                    users.length < 3 && users.length > 1 ?
                        users.map((v, i) => {
                            if(i === users.length - 1) return `and ${v} are typing...`;
                            if(i + 1 === users.length - 1) return `${v} `;
                            
                            return `${v}, `;
                        })
                    : null
                }
                {
                    users.length === 1 ?
                        `${users[0]} is typing...`
                    : null
                }
            </span>
        </div>
    );
}

export default TypingNotification;
