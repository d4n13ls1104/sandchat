import "reflect-metadata";
import { hash } from "bcryptjs";
import { User } from "../../../entity/User";
import { Resolver, Mutation, Arg } from "type-graphql";
import { RegisterInput } from "./register/RegisterInput";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { Channel } from "../../../entity/Channel";
import { getRepository } from "typeorm";

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(
		@Arg("data") { email, username, password }: RegisterInput
	): Promise<User> {
		try {
			const hashedPassword = await hash(password, 12);
			
			const devChannel = await Channel.findOne(1, { relations: ["members"] });

			const user = User.create({
				email,
				username,
				password: hashedPassword
			});

			devChannel!.members.push(user);

			await getRepository(Channel).save(devChannel!);

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