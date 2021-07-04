import { Request, Response } from "express";

export interface SandContext {
    req: Request,
    res: Response
}