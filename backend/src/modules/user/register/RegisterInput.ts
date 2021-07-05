import { IsEmail, Matches, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyRegistered } from "./isEmailAlreadyRegistered";
import { IsUsernameAlreadyRegistered } from "./isUsernameAlreadyRegistered";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail(undefined, { message: "Please enter a valid email." })
  @IsEmailAlreadyRegistered({ message: "Email is already registered."})
  email: string;

  @Field()
  @Length(1, 16)
  @Matches("^[a-zA-Z0-9_.-]*$", undefined, { message: "Username may only contain letters, numbers or: '_', '.', and '-'." })
  @IsUsernameAlreadyRegistered({ message: "Username is already registered." })
  username: string;

  @Field()
  @Length(8, undefined, { message: "Password must be at least 8 characters in length." })
  password: string;
}