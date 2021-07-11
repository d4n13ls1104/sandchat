import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";
@InputType()
export class CreateMessageInput {
    @Field()
    channelId: number;

    @Field()
    @Length(1, 4000)
    content: string;
}