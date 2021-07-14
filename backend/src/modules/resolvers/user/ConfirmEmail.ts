import "reflect-metadata";
import { User } from "../../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { redis } from "../../../redis";
import { confirmUserPrefix } from "../../constants/redisPrefixes";

@Resolver()
export class ConfirmEmailResolver {
    @Mutation(() => Boolean)
    async confirmEmail(@Arg("token") token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if(!userId) return false; 

        await User.update({ id: userId }, { confirmedEmail: true });
        await redis.del(confirmUserPrefix + token);

        return true;
    }
}