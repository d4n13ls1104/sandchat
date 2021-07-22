import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
import { IsNotBlank } from "modules/resolvers/message/createMessage/IsNotBlank";

@InputType()
export class CreateMessageInput {
    @Field()
    channelId: string;

    @Field()
    @IsNotBlank({ message: "Message cannot be empty." })
    @Length(1, 4000)
    content: string;
}