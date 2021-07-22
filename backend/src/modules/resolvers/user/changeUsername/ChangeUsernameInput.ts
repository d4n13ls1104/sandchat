import { IsNotBlank } from "modules/resolvers/message/createMessage/IsNotBlank";
import { InputType, Field } from "type-graphql";
import { Length, Matches } from "class-validator";
import { IsUsernameAlreadyRegistered } from "../register/isUsernameAlreadyRegistered";

@InputType()
export class ChangeUsernameInput {
    @Field()
    @Length(1, 16, { message: "Username must be 1-16 characters." })
    @Matches("^[a-zA-Z0-9_.-]*$", undefined, { message: "Username may only contain letters, numbers or: '_', '.', and '-'." })
    @IsUsernameAlreadyRegistered({ message: "Username is already registered." })
    @IsNotBlank()
    username: string;
}