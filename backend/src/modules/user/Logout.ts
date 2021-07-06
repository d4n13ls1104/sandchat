import "reflect-metadata";
import { Resolver, Mutation, Ctx } from "type-graphql";
import { SandContext } from "../../types/SandContext";

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: SandContext): Promise<boolean> {
        return new Promise((resolve, reject) => {
            ctx.req.session.destroy((err) => {
                if(err) {
                    console.error(err);
                    return reject(false);
                }

                ctx.res.clearCookie("qid");
                return resolve(true);
            });
        });
    }
}