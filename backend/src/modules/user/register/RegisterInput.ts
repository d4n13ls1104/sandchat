import { Length, IsEmail, Matches} from "class-validator"
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExists } from "./isEmailAlreadyExists";

@InputType()
export class RegisterInput {
    @Field()
    @IsEmail()
    @IsEmailAlreadyExists({ message: "email is already registered" })
    email: string;

    @Field()
    @Length(1, 16)
    @Matches("^[a-zA-Z0-9_\.\-]*$")
    username: string;

    @Field()
    @Length(8)
    password: string;
}