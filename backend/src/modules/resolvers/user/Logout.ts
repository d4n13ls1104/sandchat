import "reflect-metadata";
import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { SandContext } from "../../../type/SandContext";
import { isAuth } from "../../middlewares/isAuth";

@Resolver()
export class LogoutResolver {
    @UseMiddleware(isAuth)
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