import { MiddlewareFn } from "type-graphql";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession} from "types/ExtendedSession";

export const isAuth: MiddlewareFn<ApolloContext> = async ({ context }, next) => {
    if(!(context.req.session as ExtendedSession).userId) throw Error("Not authenticated");
    
    return next();
}