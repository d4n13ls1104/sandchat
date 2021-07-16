import { IMessage } from "components/Home/Message";
// converts graphql response to IMessage array
export const formatMessageQueryResponse = (messageData: any): IMessage[] => {
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