import "reflect-metadata";
import { User } from "../../../entity/User";
import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { SandContext } from "../../../type/SandContext";
import { SandSession } from "../../../type/SandSession";
import { isAuth } from "../../middlewares/isAuth";

@Resolver()
export class MeResolver {
    @UseMiddleware(isAuth)
    @Query(() => User, { nullable: true })
    async me(@Ctx() ctx: SandContext): Promise<User | undefined> {
        if(!(ctx.req.session as SandSession).userId) return undefined;

        return User.findOne((ctx.req.session as SandSession).userId);
    }
}