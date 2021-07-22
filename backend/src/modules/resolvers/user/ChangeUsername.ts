import "reflect-metadata";
import { User } from "entity/User";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession } from "types/ExtendedSession";
import { ChangeUsernameInput } from "modules/resolvers/user/changeUsername/ChangeUsernameInput";

@Resolver()
export class ChangeUsernameResolver {
    @Mutation(() => Boolean)
    async changeUsername(@Arg("data") { username }: ChangeUsernameInput, @Ctx() ctx: ApolloContext): Promise<boolean> {
       const user = await User.findOne((ctx.req.session as ExtendedSession).userId);

       if(!user) return false;

       user.username = username;

       await User.save(user);
       
       return true;
    }
}