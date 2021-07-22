import "reflect-metadata";
import { User } from "entity/User";
import { Channel } from "entity/Channel";
import { Resolver, Query, Arg, UseMiddleware, Ctx } from "type-graphql";
import { isAuth } from "modules/middlewares/isAuth";
import { GetMessagesInput } from "modules/resolvers/message/getMessages/GetMessagesInput";
import { ApolloContext } from "types/ApolloContext";
import { ExtendedSession } from "types/ExtendedSession";
import { Message } from "entity/Message";

@Resolver()
export class GetMessagesResolver {
    @UseMiddleware(isAuth)
    @Query(() => [Message], { nullable: true })
    async getMessages(
        @Arg("data") { channelId, beforeDate }: GetMessagesInput,
        @Ctx() ctx: ApolloContext
    ): Promise<Message[] | undefined> {
        const user = await User.findOne((ctx.req.session as ExtendedSession).userId);

        const channel = await Channel.findOne(channelId); 

        if(!channel) throw Error("Channel does not exist.");
        
        const userIsChannelMember = await User.createQueryBuilder("user")
            .leftJoinAndSelect("user.channels", "userChannels")
            .where("user.id = :userId", { userId: user!.id })
            .andWhere("userChannels.id = :channelId", { channelId })
            .getOne() !== undefined;

        if(!userIsChannelMember) throw Error("You are not a member of this channel.");

        const channelMessages = await Channel.createQueryBuilder("channel")
            .leftJoinAndSelect("channel.messages", "messages")
            .leftJoinAndSelect("messages.author", "author")
            .where("messages.timestamp < :beforeDate", { beforeDate })
            .andWhere("messages.isDeleted = false")
            .orderBy("messages.timestamp", "DESC")
            .limit(30)
            .getOne();

        return channelMessages?.messages;
    }
}