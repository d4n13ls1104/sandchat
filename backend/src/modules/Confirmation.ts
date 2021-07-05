import "reflect-metadata";
import { User } from "../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { redis } from "../redis";
import { confirmUserPrefix } from "./constants/redisPrefixes";

@Resolver()
export class ConfirmationResolver {
    @Mutation(() => Boolean)
    async confirmEmail(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if(!userId) return false; 

        await User.update({ id: parseInt(userId, 10) }, { confirmedEmail: true });
        await redis.del(token);

        return true;
    }
}