import "reflect-metadata";
import { User } from "../../../entity/User";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserCountResolver {
    @Query(() => Number)
    async userCount() {
        return await User.count();
    }
}