import "reflect-metadata";
import { Resolver, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { ApolloContext } from "types/ApolloContext";
import { isAuth } from "modules/middlewares/isAuth";

@Resolver()
export class LogoutResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: ApolloContext): Promise<boolean> {
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