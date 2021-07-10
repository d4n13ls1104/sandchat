import { MiddlewareFn } from "type-graphql";
import { SandContext } from "../../types/SandContext";
import { SandSession } from "../../types/SandSession";

export const isAuth: MiddlewareFn<SandContext> = async ({ context }, next) => {
    if(!(context.req.session as SandSession).userId) throw Error("Not authenticated");
    
    return next();
}
