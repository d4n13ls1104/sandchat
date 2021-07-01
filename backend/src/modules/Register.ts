import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "../entity/User";
import {
    Resolver,
    Mutation,
    Arg,
    Query
} from "type-graphql";

import { RegisterInput } from "../modules/user/register/RegisterInput";

@Resolver()
export class RegisterResolver {
    @Query(() => String)
    async hello() {
        return "Hello World.";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") { email, username, password }: RegisterInput
        ): Promise<User> {
        const hashedPassword = await hash(password, 12);

        const user = await User.create({
            email,
            username,
            password: hashedPassword
        }).save();

        return user;
    }
}