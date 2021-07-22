import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { RegisterInput } from "modules/resolvers/user/register/RegisterInput";
import { sendEmail } from "modules/utils/sendEmail";
import { createConfirmationUrl } from "modules/utils/createConfirmationUrl";
import { Channel } from "entity/Channel";

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(
		@Arg("data") { email, username, password }: RegisterInput
	): Promise<User> {
		try {
			const hashedPassword = await hash(password, 12);

			const devChannel = await Channel.findOne("32d86642-37f2-4833-b4d3-382caac01a12", { relations: ["members"] });

			const user = User.create({
				email,
				username,
				password: hashedPassword
			});

			devChannel!.members.push(user);

			Channel.save(devChannel!);

			const confirmationUrl = await createConfirmationUrl(user.id);

			sendEmail({
				from: '<noreply@chat.sandtee.ml>',
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