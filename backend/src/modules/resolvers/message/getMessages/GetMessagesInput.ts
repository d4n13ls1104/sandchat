import { InputType, Field } from "type-graphql";

@InputType()
export class GetMessagesInput {
    @Field()
    channelId: string;

    @Field()
    beforeDate: string;
}