import "reflect-metadata";
import { User } from "../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../../modules/constants/redisPrefixes";
import { hash } from "bcryptjs";

@Resolver()
export  class ChangePasswordResolver {
    @Mutation(() => Boolean)
    async changePassword(@Arg("data") { token, password }: ChangePasswordInput): Promise<boolean> {
        const userId = await redis.get(forgotPasswordPrefix + token);

        if(!userId) return false;

        const hashedPassword = await hash(password, 12);
        
        await User.update({ id: parseInt(userId, 10) }, { password: hashedPassword });
        await redis.del(forgotPasswordPrefix + token);

        return true;
    }
}