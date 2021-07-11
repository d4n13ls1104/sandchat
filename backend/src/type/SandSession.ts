import { Session } from "express-session";

export interface SandSession extends Session {
    userId: number
}