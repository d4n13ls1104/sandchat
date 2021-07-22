import "reflect-metadata";
import { compare } from "bcryptjs";
import { User } from "entity/User";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { LoginInput } from "modules/resolvers/user/login/LoginInput";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession } from "types/ExtendedSession";

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() ctx: ApolloContext
    ): Promise<User> {
        const user = await User.findOne({ where: { email } });

        if(!user) throw Error("User does not exist.");

        if(!user.confirmedEmail) throw Error("Please confirm your email.");

        const passwordIsValid = await compare(password, user.password);

        if(!passwordIsValid) throw Error("Invalid credentials.");

        (ctx.req.session as ExtendedSession).userId = user.id;

        return user;
    }
}