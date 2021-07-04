import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "../entity/User";
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { RegisterInput } from "./user/register/RegisterInput";
import { sendEmail } from "./utils/sendEmail";
import { createConfirmationUrl } from "./utils/createConfirmationUrl";

@Resolver()
export class RegisterResolver {
	@Query(() => String)
	async hello() {
		return "Placeholder query so graphql shuts its fucking mouth";
	}

	@Mutation(() => User)
	async register(
		@Arg("data") { email, username, password }: RegisterInput
	): Promise<User> {
		const hashedPassword = await hash(password, 12);

		const user = await User.create({
			email,
			username,
			password: hashedPassword
		}).save();

		const verificationUrl = await createConfirmationUrl(user.id);

		await sendEmail({
			from: '"noreply" <noreply@chat.sandtee.tk>',
			to: email,
			subject: "Please confirm your email",
			text: "Test",
			html: `<a href="${verificationUrl}">${verificationUrl}</a>`
		});

		return user;
	}
}