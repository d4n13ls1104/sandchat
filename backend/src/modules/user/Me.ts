import "reflect-metadata";
import { User } from "../../entity/User";
import { Resolver, Query, Ctx } from "type-graphql";
import { SandContext } from "../../types/SandContext";
import { SandSession } from "../../types/SandSession";

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: SandContext): Promise<User | undefined> {
        if(!(ctx.req.session as SandSession).userId) return undefined;

        return await User.findOne((ctx.req.session as SandSession).userId);
    }
}