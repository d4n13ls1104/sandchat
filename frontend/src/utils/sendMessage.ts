import { Socket } from "socket.io-client";
import { IMessage } from "components/Home/Message";

export const sendMessage = (socket: Socket, message: IMessage) => {
   socket.emit("message", message);
}