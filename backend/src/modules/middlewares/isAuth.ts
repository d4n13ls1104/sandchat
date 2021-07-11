import { MiddlewareFn } from "type-graphql";
import { SandContext } from "../../type/SandContext";
import { SandSession } from "../../type/SandSession";

export const isAuth: MiddlewareFn<SandContext> = async ({ context }, next) => {
    if(!(context.req.session as SandSession).userId) throw Error("Not authenticated");
    
    return next();
}