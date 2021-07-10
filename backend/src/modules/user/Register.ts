import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { RegisterInput } from "../user/register/RegisterInput";
import { sendEmail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { Channel } from "entity/Channel";

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(
		@Arg("data") { email, username, password }: RegisterInput
	): Promise<User> {
		try {
			const hashedPassword = await hash(password, 12);

			const channel = await Channel.findOne(1); // default channel during development

			const user = await User.create({
				email,
				username,
				password: hashedPassword,
				channels: [channel!]
			}).save();

			const confirmationUrl = await createConfirmationUrl(user.id);

			await sendEmail({
				from: '<noreply@chat.sandtee.tk>',
				to: email,
				subject: "Please confirm your email",
				text: "Test",
				html: `<a href="${confirmationUrl}">${confirmationUrl}</a>`
			});

			return user;
		} catch(err) {
			console.error(err);
			throw new Error("Something went wrong. Please try again later.");
		}
	}
}