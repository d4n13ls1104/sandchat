import { IsEmail, Matches, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyRegistered } from "./isEmailAlreadyRegistered";
import { IsUsernameAlreadyRegistered } from "./isUsernameAlreadyRegistered";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyRegistered({ message: "email is already registered"})
  email: string;

  @Field()
  @Length(1, 16)
  @Matches("^[a-zA-Z0-9_.-]*$")
  @IsUsernameAlreadyRegistered({ message: "username is already registered" })
  username: string;

  @Field()
  @Length(8)
  password: string;
}