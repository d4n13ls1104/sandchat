import "reflect-metadata";
import { User } from "entity/User";
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession } from "types/ExtendedSession";
import { isAuth } from "modules/middlewares/isAuth";

@Resolver()
export class MeResolver {
    @UseMiddleware(isAuth)
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: ApolloContext): Promise<User | undefined> {
        if(!(ctx.req.session as ExtendedSession).userId) return undefined;

        return User.findOne((ctx.req.session as ExtendedSession).userId);
    }
}