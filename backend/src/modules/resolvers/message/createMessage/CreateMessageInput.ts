import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
import { IsNotBlank } from "./isNotBlank";

@InputType()
export class CreateMessageInput {
    @Field()
    channelId: number;

    @Field()
    @IsNotBlank({ message: "Message cannot be empty." })
    @Length(1, 4000)
    content: string;
}