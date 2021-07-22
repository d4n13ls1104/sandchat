import { Session } from "express-session";

export interface ExtendedSession extends Session {
    userId: string 
}