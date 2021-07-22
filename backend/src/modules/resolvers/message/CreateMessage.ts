import "reflect-metadata";
import { User } from "entity/User";
import { Channel } from "entity/Channel"
import { Message } from "entity/Message";
import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";
import { isAuth } from "modules/middlewares/isAuth";
import { CreateMessageInput } from "./createMessage/CreateMessageInput";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession } from "types/ExtendedSession";

@Resolver()
export class CreateMessageResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => Message)
    async createMessage(
        @Arg("data") { channelId, content }: CreateMessageInput,
        @Ctx() ctx: ApolloContext
    ): Promise<Message> {
        const user = await User.findOne((ctx.req.session as ExtendedSession).userId);

        const channel = await Channel.findOne(channelId);

        if(!channel) throw Error("Channel does not exist.");

        const userIsChannelMember = await User.createQueryBuilder("user")
            .leftJoinAndSelect("user.channels", "userChannels")
            .where("user.id = :userId", { userId: user!.id })
            .andWhere("userChannels.id = :channelId", { channelId })
            .getOne() !== undefined;

        if(!userIsChannelMember) throw Error("You are not a member of this channel.");
        
        const message = await Message.create({
            channel: channel,
            author: user,
            content: content
        }).save();
        
        return message;
    }
}