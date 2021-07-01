import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "src/entity/User";
import {
    Resolver,
    Mutation,
    Arg,
} from "type-graphql";

import { RegisterInput } from "src/modules/user/register/RegisterInput";

@Resolver()
export class RegisterResolver {
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