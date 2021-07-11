import { InputType, Field } from "type-graphql";

@InputType()
export class GetMessagesInput {
    @Field()
    channelId: number;

    @Field()
    beforeDate: string;
}