import "reflect-metadata";
import { compare } from "bcryptjs";
import { User } from "../../entity/User";
import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { LoginInput } from "../user/login/LoginInput";
import { SandContext } from "../../types/SandContext";
import { SandSession } from "../../types/SandSession";

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() ctx: SandContext
    ): Promise<User> {
        const user = await User.findOne({ where: { email } });

        if(!user) throw Error("User does not exist.");

        if(!user.confirmedEmail) throw Error("Please confirm your email.");

        const passwordIsValid = await compare(password, user.password);

        if(!passwordIsValid) throw Error("Invalid credentials.");

        (ctx.req.session as SandSession).userId = user.id;

        return user;
    }
}